import os
import shutil

cwd = os.getcwd()
results = os.path.join(cwd, "results")

icons = os.listdir(cwd)
icons.remove("results")

for name in icons:
    lower_name = name.lower()
    shutil.copy(os.path.join(cwd, name), os.path.join(results, lower_name))
