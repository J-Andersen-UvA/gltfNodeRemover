# gltfNodeRemover
Don't you just hate extra nodes that do nothing in your animation? Just remove them!

## Overview
`gltfNodeRemover` is a Node.js script designed to clean up unnecessary nodes from your GLB/GLTF files. It processes your animations and outputs optimized versions, saving you time and effort.

## Features
- Automatically removes unwanted nodes based on a configurable list (`nodesToRemove`).
- Outputs processed files to a designated folder.
- Supports overwriting original files or saving to a separate folder.
- Customizable input, output, and overwrite settings via command-line arguments.

## Prerequisites
- Node.js: Make sure you have Node.js installed on your system. You can download it [here](https://nodejs.org/en).

## How to Use
1. Prepare your GLTF/GLB files:
    - Place your GLTF/GLB files in the `/in` folder.
2. Customize nodes to remove (optional):
    - Open the `removeNodes.js` file and modify the `nodesToRemove` constant to fit your needs:
    ```javascript
    const nodesToRemove = [
    "ARIEL", "LFHD", "LBHD", "RFHD", "RBHD", "C7", // Example nodes
    ];
    ```
3. Run the script:
    - Use the following command to execute the script:
    ```bash
    node removeNodes.js
    ```
4. Processed output:
    - Your cleaned animations will be saved in the `/out` folder by default. If you want to overwrite the input files, use the `--overwrite` flag.

## Command-Line Options
You can customize the behavior of the script using these options:
| Option       | Alias | Default  | Description                                       |
|--------------|-------|----------|---------------------------------------------------|
| `--input`    | `-i`  | `./in`   | Specify the input folder for GLTF/GLB files.      |
| `--output`   | `-o`  | `./out`  | Specify the output folder for processed files.    |
| `--overwrite`| `-w`  | `false`  | Overwrite the input files instead of outputting to a separate folder. |
