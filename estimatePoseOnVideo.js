const posenet = require('@tensorflow-models/posenet');
const fs = require('fs');
const path = require('path');

const tfjs = require('@tensorflow/tfjs-node');

// if cuda available, uncommment this:
// const tfjs = require('@tensorflow/tfjs-node-gpu');

async function loadImage(path) {
  const file = await fs.promises.readFile(path);

  const image = await tfjs.node.decodeImage(file, 3);

  return image;
}

async function savePosesByFrameToFile(poses, path) {
  await fs.promises.writeFile(path, JSON.stringify({poses: poses}));
}

async function getFilesInFolder(path) {
  return await fs.promises.readdir(path);
}

async function main() {
  const image = await loadImage('./assets/frames/0001.png');

  const imageSize = image.shape;
  const imageHeight = imageSize[0];
  const imageWidth = imageSize[1];

  console.log('loading posenet');

  const net = await posenet.load({
    architecture: "ResNet50",
    quantBytes: 4,
    outputStride: 16,
    inputResolution: {
      width: imageWidth * .5,
      height: imageHeight * .5
    } 
  });

  console.log('estimating poses');
  const filesFolder = './assets/frames';

  const filesInFolder = await getFilesInFolder(filesFolder);

  const posesByFrame = [];

  console.log('number of files in folder', filesInFolder.length);

  for(let i = 0; i < filesInFolder.length; i++) {
    console.log('frame ', i);
    const file = filesInFolder[i];

    const fullPath = path.join(filesFolder, file);

    const input = await loadImage(fullPath);

    const poses = await net.estimateMultiplePoses(input, {
      maxDetections: 30
    });

    input.dispose();

    posesByFrame.push(poses);
  }

  await savePosesByFrameToFile(posesByFrame, './data/soccer_poses.json');
}


main();