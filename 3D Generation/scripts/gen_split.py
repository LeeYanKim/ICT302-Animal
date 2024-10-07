import ffmpeg
from pathlib import Path
import argparse
import os

import io
from contextlib import redirect_stdout

parser=argparse.ArgumentParser(description="sample argument parser")
parser.add_argument("-i", '--item', nargs='?', default="./", help='Item to process')
parser.add_argument("-v", '--videoRoot', nargs='?', default="./", help='Video root to process')
parser.add_argument("-u", '--user', nargs='?', default=0, help='UUID of user')
parser.add_argument("-g", '--graphic', nargs='?', default=0, help='GPCID of graphic')
parser.add_argument("-a", '--animal', nargs='?', default=0, help='Animal ID')
args=parser.parse_args()

# ffmpeg -i [gpcid].mp4 images/%03d.png
inputPath = args.videoRoot + "/" + args.item
outputPath = args.videoRoot + "/" + args.graphic + "/images"
outputFormat = "/%03d.png"

print(inputPath)

try:
    os.makedirs(outputPath)
except FileExistsError:
    pass # directory already exists


video = ffmpeg.input(inputPath)
video = ffmpeg.output(video ,outputPath + outputFormat, loglevel="quiet")

trap = io.StringIO()
with redirect_stdout(trap):
    ffmpeg.run(video)

print("images output to: {out}".format(out = outputPath))