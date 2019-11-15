const bodyPix = require('@tensorflow-models/body-pix');
const fs = require('fs');
const path = require('path');

const tfjs = require('@tensorflow/tfjs-node');
const pngjs = require('pngjs');

async function loadImage(path) {
  const file = await fs.promises.readFile(path);

  const image = await tfjs.node.decodeImage(file, 3);

  return image;
}

async function getFilesInFolder(path) {
  return await fs.promises.readdir(path);
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
  console.log('loading bodypix');

  const net = await bodyPix.load({
    architecture: "ResNet50",
    quantBytes: 1,
    outputStride: 16
  });

  console.log('estimating segmentations');

  const filesFolder = './assets/frames';

  const filesInFolder = await getFilesInFolder(filesFolder);

  for(let i = 0; i < filesInFolder.length; i++) {
    console.log('frame ', i);
    const file = filesInFolder[i];

    const fullPath = path.join(filesFolder, file);

    const input = await loadImage(fullPath);

    const personSegmentation = await net.segmentPerson(input, {
      internalResolution: "low",
      segmentationThreshold: 0.2
    });
    
    personSegmentation.data.map(value => value * 255)

    await saveSegmentationToFile(personSegmentation, './data/segmentations/' + file);
  }


}


main();