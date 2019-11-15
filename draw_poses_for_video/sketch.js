let soccer;

let posesData;
let soccerVideo;
let playing = false;

function preload() {
  // Get the most recent earthquake in the database
  posesData = loadJSON('/data/soccer_poses.json');
}

function setup() {
  createCanvas(1920, 1080);
  soccerVideo = createVideo(['/assets/cut.mp4']);
  soccerVideo.hide();
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

function drawPoses(poses) {
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

const FPS = 29.97;
function draw() {
  background(0);
  if (playing) {
    image(soccerVideo, 0, 0);
    const currentTime = soccerVideo.time();

    const frame = Math.round(currentTime * FPS);

    const poseOfFrame = posesData.poses[frame];

    console.log('poses', poseOfFrame)
    drawPoses(poseOfFrame);
  }
}

function mousePressed() {
  soccerVideo.loop(); // set the video to loop and start playing
  playing = true;
}