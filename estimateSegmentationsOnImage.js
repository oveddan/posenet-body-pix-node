const bodyPix = require('body-pix-node');
const fs = require('fs');

const tfjs = require('@tensorflow/tfjs-node');
const pngjs = require('pngjs');

async function loadImage(path) {
  const file = await fs.promises.readFile(path);

  const image = await tfjs.node.decodeImage(file, 3);

  return image;
}

async function saveSegmentationToFile(segmentation, path) {
  const pngImage = new pngjs.PNG({
    colorType: 0, 
    width: segmentation.width, 
    height: segmentation.height, 
    inputColorType: 0,
    data: segmentation.data
  });

  // console.log('data', segmentation.data);
  pngImage.data = Buffer.from(segmentation.data.map(pixel => pixel * 255));

  return new Promise((resolve) => {
    pngImage.pack().pipe(fs.createWriteStream(path)).on('close', () => resolve());
  });
}

async function main() {
  const image = await loadImage('./assets/dance.jpg');

  console.log('loading bodypix');

  const net = await bodyPix.load({
    architecture: "ResNet50",
    quantBytes: 1,
    outputStride: 16
  });

  console.log('estimating segmentation');

  const personSegmentation = await net.segmentPerson(image, {
    internalResolution: "full",
    segmentationThreshold: 0.2
  });

  personSegmentation.data.map(value => value * 255)

  await saveSegmentationToFile(personSegmentation, './data/dances_segmentation.png');
}


main();