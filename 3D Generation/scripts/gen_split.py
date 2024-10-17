import ffmpeg
from pathlib import Path
import argparse
import os

import io
from contextlib import redirect_stdout

parser=argparse.ArgumentParser(description="sample argument parser")
parser.add_argument("-v", '--video', nargs='?', default="", help='Video to process')
args=parser.parse_args()

# ffmpeg -i [gpcid].mp4 images/%03d.png

if args.video == "":
    print("Please provide a video to process")
    exit()

inputVideoPath = args.video
inputVideoBasePath = os.path.dirname(inputVideoPath)
inputVideoFile = os.path.basename(inputVideoPath)
inputVideoName = os.path.splitext(inputVideoFile)[0]
inputVideoExt = os.path.splitext(inputVideoFile)[1]

outputPath = os.path.join(inputVideoBasePath, inputVideoName, "images")
outputFormat = "/%03d.png"

try:
    os.makedirs(outputPath)
except FileExistsError:
    pass # directory already exists


video = ffmpeg.input(inputVideoPath).filter(filter_name="fps", fps=30/4).output(outputPath + outputFormat, loglevel="quiet")
#video = ffmpeg.output(video ,outputPath + outputFormat, loglevel="quiet")
#video = ffmpeg.filter(filter_name="fps", fps=30/4)

trap = io.StringIO()
with redirect_stdout(trap):
    ffmpeg.run(video)

print("images output to: {out}".format(out = outputPath))