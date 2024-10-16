from pathlib import Path
import argparse
import os

import io
from contextlib import redirect_stdout

parser=argparse.ArgumentParser(description="sample argument parser")
parser.add_argument("-p", '--path', nargs='?', default="", help='Path to process')
args=parser.parse_args()

print("Generating at path:" + args.path)