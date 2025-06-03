#!/bin/bash
set -e

dest="assets/vendor"
mkdir -p "$dest"

# Empty directory.
rm -rf "$dest"/*

# Retrieve copyFiles array from package.json
files=$(jq -r '.copyFiles[]' package.json)

# Copy each file.
for file in $files; do
  cp "$file" "$dest/"
done
