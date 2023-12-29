#!/bin/bash
# ONLY RUN THIS SCRIPT FROM THE ROOT FOLDER OF THIS PROJECT
dist="dist"
version=$(grep -o '"version": *[^,}]*' "./manifest.json" |
    sed 's/"version": //' |
    tr -d '"')

mkdir -p "$dist"

find . '(' \
    -ipath "./icons/*.png" -o \
    -ipath "./sounds/4.wav" -o \
    '(' -ipath "./src/*" ! -name "jsconfig.json" ')' -o \
    -ipath "./LICENSE.txt" -o \
    -ipath "./manifest.json" \
    ')' -print |
    zip -@r "./$dist/chromium-v$version.zip"