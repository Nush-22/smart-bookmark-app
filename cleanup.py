#!/usr/bin/env python3
import shutil
import os

callback_dir = r"c:\Users\Anushka Gupta\bookmark\smart-bookmark-app\src\app\auth\callback"
try:
    if os.path.exists(callback_dir):
        shutil.rmtree(callback_dir)
        print(f"Deleted: {callback_dir}")
    else:
        print(f"Directory not found: {callback_dir}")
except Exception as err:
    print(f"Error: {err}")
