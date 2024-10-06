import os
import numpy as np
import torch
import matplotlib.pyplot as plt
import cv2
import sys
sys.path.append("..")
from segment_anything import sam_model_registry, SamAutomaticMaskGenerator, SamPredictor
import argparse
import fnmatch
import statistics
import clip
from PIL import Image


parser=argparse.ArgumentParser(description="sample argument parser")
parser.add_argument("-p", '--path', nargs='?', default="./", help='Root path for mask generation') # Root path for masking.
parser.add_argument("-m", '--mask_hint', nargs='?', default="dog", help='Mask hint') # text hint for mask generation.
parser.add_argument("-d", '--dry', action='store_true', help='Run dry without saving output masks') # Do a dry run and not output files
args=parser.parse_args()

def show_anns(anns):
    if len(anns) == 0:
        return
    sorted_anns = sorted(anns, key=(lambda x: x['area']), reverse=True)
    ax = plt.gca()
    ax.set_autoscale_on(False)

    img = np.ones((sorted_anns[0]['segmentation'].shape[0], sorted_anns[0]['segmentation'].shape[1], 4))
    img[:,:,3] = 0
    col = [0,1,0,0.5]
    maxArea = max(x['area'] for x in sorted_anns) #, key=lambda x: x['area']
    minArea = min(x['area'] for x in sorted_anns)
    totalArea = sum(x['area'] for x in sorted_anns)
    avgArea = statistics.mean(x['area'] for x in sorted_anns)
    #print("Max mask area: {mx}, Min mask area: {mi}, Total mask area: {total}, Average mask area: {ag}".format(mx = maxArea, mi = minArea, total = totalArea, ag = avgArea))

    for ann in range(len(sorted_anns)):
        m = sorted_anns[ann]['segmentation']
        color_mask = [0,0,0,0]
        if sorted_anns[ann]['area'] < avgArea:
            color_mask = col
        img[m] = color_mask
    ax.imshow(img)

def get_clip_similarity(image, text):
    # Convert image from NumPy array (OpenCV format) to PIL Image
    pil_image = Image.fromarray(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    # Preprocess image and text
    image_input = preprocess(pil_image).unsqueeze(0).to(device)
    text_input = clip.tokenize([text]).to(device)

    # Extract CLIP embeddings
    with torch.no_grad():
        image_features = clip_model.encode_image(image_input)
        text_features = clip_model.encode_text(text_input)

    # Normalize features
    image_features /= image_features.norm(dim=-1, keepdim=True)
    text_features /= text_features.norm(dim=-1, keepdim=True)

    # Calculate similarity
    similarity = (image_features @ text_features.T).item()
    return similarity

def refine_mask_with_clip(image, mask_tensor, text_hint, mask_quality_tensor):
    num_masks = mask_tensor.shape[0] 
    height, width = mask_tensor.shape[1], mask_tensor.shape[2]

    text_inputs = clip.tokenize([text_hint]).to(device)

    best_mask_idx = None
    best_combined_score = -float('inf')

    for mask_idx in range(num_masks):
        mask = mask_tensor[mask_idx, :, :]
        binary_mask = (mask * 255).astype(np.uint8)

        masked_region = cv2.bitwise_and(image, image, mask=binary_mask)

        masked_region_rgb = Image.fromarray(cv2.cvtColor(masked_region, cv2.COLOR_BGR2RGB))

        image_input = preprocess(masked_region_rgb).unsqueeze(0).to(device)

        with torch.no_grad():
            image_features = clip_model.encode_image(image_input)
            text_features = clip_model.encode_text(text_inputs)
            similarity_score = (image_features @ text_features.T).item()

        sam_score = mask_quality_tensor[mask_idx]
        combined_score = similarity_score + sam_score

        if combined_score > best_combined_score:
            best_combined_score = combined_score
            best_mask_idx = mask_idx

    best_mask = mask_tensor[best_mask_idx, :, :]
    best_binary_mask = (best_mask * 255).astype(np.uint8)

    return best_binary_mask

def apply_mask_to_image(image, binary_mask):
    subject_mask = binary_mask.astype(np.uint8)
    
    inverted_mask = cv2.bitwise_not(subject_mask)

    masked_frame = cv2.bitwise_and(image, image, mask=inverted_mask)

    green_background = np.full_like(image, (0, 255, 0))

    output_frame = np.where(subject_mask[..., None], green_background, masked_frame)

    return output_frame

def select_best_masks(mask_array, mask_quality_array, threshold=0.5):
    selected_masks = []
    for idx, quality in enumerate(mask_quality_array):
        if quality > threshold:
            selected_masks.append(mask_array[idx])
    return np.array(selected_masks)

def refine_mask(mask):
    kernel = np.ones((5, 5), np.uint8)
    refined_mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    return refined_mask

def smooth_mask(mask):
    return cv2.GaussianBlur(mask, (5, 5), 0)

def select_best_masks(mask_array, mask_quality_array, threshold=0.5):
    selected_masks = []
    for idx, quality in enumerate(mask_quality_array):
        if quality > threshold:  # Adjust threshold as necessary
            selected_masks.append(mask_array[idx])
    return np.array(selected_masks)

def combine_masks(masks):
    combined_mask = np.zeros_like(masks[0])
    for mask in masks:
        combined_mask = np.maximum(combined_mask, mask)
    return combined_mask

imageRoot = args.path
imageFolder = "/images"
maskFolder = "/masks"

sam_checkpoint = "sam_vit_h_4b8939.pth"
model_type = "vit_h"

text_hint = args.mask_hint

if args.dry == True:
    print("\nIT01: Running DRY mask generation")
    print("\tRoot Path: {path}".format(path = imageRoot))
    print("\tImage Path: {imgPath}".format(imgPath = imageRoot + imageFolder))
    print("\tMask Output Path: {outPath}".format(outPath = imageRoot + maskFolder))
    print("\tMask Gen Hint: {hint}\n".format(hint = text_hint))
else:
    print("IT01: Running mask generation with the following arguments:")
    print("\tRoot Path: {path}".format(path = imageRoot))
    print("\tImage Path: {imgPath}".format(imgPath = imageRoot + imageFolder))
    print("\tMask Output Path: {outPath}".format(outPath = imageRoot + maskFolder))
    print("\tMask Gen Hint: {hint}\n".format(hint = text_hint))

# Load CLIP model
print("IT01: Setting up CLIP")
device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, preprocess = clip.load("ViT-B/32", device=device)


# Load SAM model
print("IT01: Setting up SAM")
sam = sam_model_registry[model_type](checkpoint=sam_checkpoint)
sam.to(device=device)
sam_predictor = SamPredictor(sam)

mask_generator = SamAutomaticMaskGenerator(
    model=sam,
    points_per_side=32,
    pred_iou_thresh=0.86,
    stability_score_thresh=0.92,
    crop_n_layers=1,
    crop_n_points_downscale_factor=2,
    min_mask_region_area=1000,
)

print("IT01: Checking total frames in path: {imagePath}".format(imagePath = (imageRoot + imageFolder)))
numOfFrames = len(fnmatch.filter(os.listdir(imageRoot + imageFolder), '*.png'))
print("IT01: Found {totalFrames} in path {imagePath}".format(totalFrames = numOfFrames, imagePath = (imageRoot + imageFolder)))

print("IT01: Mask generation starting...")
print("IT01: Output masks into path: {outRoot}".format(outRoot = imageRoot + maskFolder + "/**.png"))
try:
    os.makedirs(imageRoot + maskFolder)
except FileExistsError:
    # directory already exists
    pass
for i in range(1, numOfFrames+1):
    n = ""
    if i <= 9:
        n = "00" + str(i)
    else: 
        if i <= 99:
            n = "0" + str(i)
        else:
            n = str(i)
    
    path = imageRoot + imageFolder +"/{frame}.png".format(frame = n)
    image = cv2.imread(path)
    outpath = imageRoot + maskFolder + "/{frame}.png".format(frame = n)

    sam_predictor.set_image(image)
    mask_tensor, mask_quality_tensor, low_res_logits  = sam_predictor.predict()

    mask_array = select_best_masks(mask_tensor, mask_quality_tensor)

    binary_mask = refine_mask_with_clip(image, mask_array, text_hint, mask_quality_tensor)

    refined_mask = refine_mask(binary_mask)
 
    output_image = apply_mask_to_image(image, refined_mask)


    print("\033[K", end="\r")
    print("{:.1%} - {pros}/{tot}".format(i / numOfFrames, pros = i, tot = numOfFrames), end="\r")
    
    #print("{:.1%} - {pros}/{tot}".format(i / numOfFrames, pros = i, tot = numOfFrames), end="\r")

    if args.dry == False:
        cv2.imwrite(outpath, output_image)
        
print("\nIT01: Complete")
    
    