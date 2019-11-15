# Running existing media through PoseNet and BodyPix in Tensorflow.js in Node

This repository has some examples of how to run images or existing video through PoseNet and BodyPix using Tensorflow.js in Node

## Setup

Clone this repository:

    git clone  https://github.com/oveddan/posenet-body-pix-node.git

Cd into the repository, and install dependencies:

    cd posenet-body-pix-node

    npm install

Install node http-server globally, so that you can start a server to serve client side files

    npm install http-server -g

Startup a local http-server, so you can view the results:

    http-server

## Running on Images

Estimating poses on an image:

    node estimatePosesOnImage.js

This will estimate poses on an image ./assets/dance.jpg and save the results of the poses in data/dances_poses.json

Now, in the browser, open  [http://localhost:8080/draw_poses_for_image/](http://localhost:8080/draw_poses_for_image/)

Estimating segmentation on an image, and saving the segmentation as a png:

    node estimateSegmentationOnImage.js

## Running on videos

Make sure you have ffmpeg installed.  Follow the instructions [here](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/wiki/Installing-ffmpeg-on-Mac-OS-X).

### Acquiring/Preparing video

The examples for video in this repository work on a video converted into individual frames. `ffmpeg` is the tool we use to convert videos into frames.

To download a video from youtube, use the [4k video downloader](http://www.4kdownload.com/)

To trim the video:

    ffmpeg -i movie.mp4 -ss 00:00:00 -t 00:00:10 -async 1 cut.mp4

The above command takes a video and cuts it to be 10 seconds long.

Then to convert this into individual frames:

    ffmpeg -i cut.mp4 ./frames/%04d.png

Which will take the cut video and extract it frame by frame into the folder ./frames

To get the framerate of a video:

    ffprobe -v 0 -of csv=p=0 -select_streams v:0 -show_entries stream=r_frame_rate video.mp4

If you have a bunch of images you want to convert into a video:

    ffmpeg -r 30 -f image2 -i %04d.png -vcodec libx264 -crf 25  -pix_fmt yuv420p video.mp4

Which takes all images in a folder that end with png, and convert them to a video at frame rate 30.

### Estimating on video:

Run ffmpeg to convert the video cut.mp4 into frames:

    ffmpeg -i ./assets/cut.mp4 ./assets/frames/%04d.png

Estimate poses on all these files and save them into a json file:

    node estimatePoseOnVideo.js

Estimate segmentations on all these files and save each segmentation as an image:

    node estimateSegmenationsOnVideo.js

To view the poses in the video open http://localhost:8080/draw_poses_for_video/

## If you Windows or Linux and have CUDA installed on your computer:

In the node.js scripts, replace the line:

    const tfjs = require('@tensorflow/tfjs-node');

with 

    const tfjs = require('@tensorflow/tfjs-node-gpu');

## Useful links

[Tensorflow.js in node api](https://js.tensorflow.org/api_node/1.3.1/)

[PoseNet](https://github.com/tensorflow/tfjs-models/tree/master/posenet)

[BodyPix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix)