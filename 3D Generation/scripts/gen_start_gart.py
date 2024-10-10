import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)
import torch
from pathlib import Path
import argparse
import io
import sys
from contextlib import redirect_stdout
import os, os.path as osp
from datetime import datetime
import numpy as np




parser=argparse.ArgumentParser(description="sample argument parser")
parser.add_argument("-g", '--gart', nargs='?', default="", help='Root path to GART')
parser.add_argument("-i", '--input', nargs='?', default="", help='Input root path that contains folders for images and poses')
args=parser.parse_args()



if args.gart != "" and args.input != "":
    sys.path.append(args.gart)

    from solver import TGFitter
    from test_utils import test
    from viz_utils import viz_dog_all

    current_dir = os.getcwd()
    gart_dir = args.gart

    torch.cuda.empty_cache()
    device = torch.device("cuda")
    dataset_mode = "custom"

    profile_fn = os.path.join(gart_dir, "profiles/dog/dog.yaml")

    input_dir = args.input
    outputDir = os.path.join(args.input, "gart_output")
    modelPath = os.path.join(gart_dir, "lib_gart/smal/smal_data/my_smpl_39dogsnorm_newv3_dog.pkl")

    print("Current directory: ", current_dir)
    print("Output directory: ", outputDir)
    print("Model path: ", modelPath)


    def start_solver():

        solve = TGFitter(
            output_dir=outputDir,
            profile_fn=profile_fn,
            mode="dog",
            template_model_path=modelPath,
            device=device
        )

        data_provider, trainset = solve.prepare_real_seq(dataset_mode, split="train", custom_data_root=input_dir)

        #_, optimized_seq = solver.run(data_provider)

        #solver.eval_fps(solver.load_saved_model(), optimized_seq, rounds=10)

        #viz_dog_all(solver, optimized_seq)

#start_solver()
    img_array = np.load(os.path.join(gart_dir, "data/dog_data_official/alaskan/images/0000.npy"), allow_pickle=True)
    print(img_array)
#
#test(
#    solver,
#    seq_name=seq_name,
#    tto_flag=True,
#    tto_step=160,
#    tto_decay=50,
#    dataset_mode=dataset_mode,
#    pose_base_lr=2e-2,
#    pose_rest_lr=2e-2,
#    trans_lr=2e-2,
#)