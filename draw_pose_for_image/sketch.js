let img;

let posesData;

function preload() {
  // Get the most recent earthquake in the database
  posesData = loadJSON('/data/dance_poses.json');
}

function setup() {
  createCanvas(2664, 986);
  img = loadImage('/assets/dance.jpg');
}


const minPoseConfidence = 0.2;
const minKeypointConfidence = 0.1;
const keypointSize = 6;

function drawKeypoint(keypoint) {
  ellipse(keypoint.position.x, keypoint.position.y, keypointSize, keypointSize);
}

function drawSegment(joint) {
  // console.log(joint);
  line(joint[0].position.x, joint[0].position.y, joint[1].position.x, joint[1].position.y);
}

function draw() {
  image(img, 0, 0);

  // console.log('num poses', poses['0']);

  const poses = posesData.poses;

  fill('cyan');

  for(let i = 0; i < poses.length; i++) {
    const pose = poses[i];
    if (pose.score >= minPoseConfidence) {
      noStroke();
      const keypoints = pose.keypoints;
      for(let j = 0; j < keypoints.length; j++) {
        const keypoint = keypoints[j];

        if (keypoint.score >= minKeypointConfidence) {
          drawKeypoint(keypoint);
        }
      }

      const skeleton = posenet.getAdjacentKeyPoints(keypoints, minKeypointConfidence);

      stroke(255, 0, 0);
      for(let j = 0; j < skeleton.length; j++) {
        drawSegment(skeleton[j]);
      }
    }
  }

}