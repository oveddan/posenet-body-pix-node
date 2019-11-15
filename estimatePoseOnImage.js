const posenet = require('@tensorflow-models/posenet');
const fs = require('fs');

const tfjs = require('@tensorflow/tfjs-node');

async function loadImage(path) {
  const file = await fs.promises.readFile(path);

  const image = await tfjs.node.decodeImage(file, 3);

  return image;
}

async function savePosesToFile(poses, path) {
  await fs.promises.writeFile(path, JSON.stringify({poses: poses}));
}

async function main() {
  const image = await loadImage('./assets/dance-2.jpg');

  const imageSize = image.shape;
  const imageHeight = imageSize[0];
  const imageWidth = imageSize[1];

  console.log('loading posenet');

  const net = await posenet.load({
    architecture: "ResNet50",
    quantBytes: 1,
    outputStride: 16,
    inputResolution: {
      width: imageWidth * 2,
      height: imageHeight * 2
    } 
  });

  console.log('estimating poses');

  const poses = await net.estimateMultiplePoses(image, {
    maxDetections: 40,
    nmsRadius: 100
  });

  console.log('got poses: ', poses.length);

  await savePosesToFile(poses, './data/dance_poses.json');
}


main();