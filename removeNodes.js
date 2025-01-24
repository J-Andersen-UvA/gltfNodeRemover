const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { prune } = require('@gltf-transform/functions');

// Command-line argument handling
const args = require('yargs/yargs')(process.argv.slice(2))
    .option('input', {
        alias: 'i',
        type: 'string',
        description: 'Input folder containing GLTF/GLB files',
        default: './in',
    })
    .option('output', {
        alias: 'o',
        type: 'string',
        description: 'Output folder for processed files',
        default: './out',
    })
    .option('overwrite', {
        alias: 'w',
        type: 'boolean',
        description: 'Overwrite input files',
        default: false,
    })
    .help()
    .argv;

// Configuration
const inputFolder = args.input;
const outputFolder = args.output;
const overwrite = args.overwrite;

// Remove all markers and system nodes
const nodesToRemove = [
    "ARIEL", "LFHD", "LBHD", "RFHD", "RBHD", "C7", "T10", "CLAV", "STRN", "LFSH", "LBSH", "LUPA", "LELB", "LIEL",
    "LFRM", "LIWR", "LOWR", "LIHAND", "LOHAND", "LTHM3", "LTHM6", "LIDX3", "LIDX6", "LMID0", "LMID6", "LRNG3",
    "LRNG6", "LPNK3", "LPNK6", "RFSH", "RBSH", "RUPA", "RELB", "RIEL", "RFRM", "RIWR", "ROWR", "RIHAND", "ROHAND",
    "RTHM3", "RTHM6", "RIDX3", "RIDX6", "RMID0", "RMID6", "RRNG3", "RRNG6", "RPNK3", "RPNK6", "LFWT", "MFWT",
    "RFWT", "LBWT", "MBWT", "RBWT", "LTHI", "LKNE", "LKNI", "LSHN", "LANK", "LHEL", "LMT5", "LMT1", "LTOE", "RTHI",
    "RKNE", "RKNI", "RSHN", "RANK", "RHEL", "RMT5", "RMT1", "RTOE", "System", "Unlabeled_Markers"
];

// Ensure output folder exists if not overwriting
if (!overwrite && !fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

async function processGLTF(filePath) {
    console.log(`Reading file: ${filePath}`);
    const io = new NodeIO();
    let document;

    try {
        document = await io.read(filePath);
    } catch (error) {
        console.error(`Failed to read file: ${filePath}`, error);
        return;
    }

    // Remove unwanted nodes
    const root = (await document).getRoot();
    const nodes = root.listNodes();
    nodes.forEach(node => {
        const nodeName = node.getName();
        if (nodesToRemove.some(substr => nodeName.includes(substr))) {
            console.log(`Removing node: ${nodeName}`);
            node.dispose();
        }
    });

    // Prune unused data
    console.log(`Pruning unused data for file: ${filePath}`);
    (await document).transform(prune());

    // Save the file
    const outputFilePath = overwrite
        ? filePath
        : path.join(outputFolder, path.basename(filePath));
    console.log(`Saving file to: ${outputFilePath}`);
    io.write(outputFilePath, document);
}

async function main() {
    console.log(`Reading input folder: ${inputFolder}`);
    const files = fs.readdirSync(inputFolder).filter(file => file.endsWith('.gltf') || file.endsWith('.glb'));

    for (const file of files) {
        const filePath = path.join(inputFolder, file);
        console.log(`Processing: ${filePath}`);
        try {
            await processGLTF(filePath);
            console.log(`Processed and saved: ${filePath}`);
        } catch (error) {
            console.error(`Failed to process ${filePath}:`, error);
        }
    }

    console.log('Processing complete.');
}

main().catch(error => console.error('Unexpected error:', error));
