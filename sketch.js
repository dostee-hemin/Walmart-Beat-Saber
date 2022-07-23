let video;
let wrists = [];
let prev = [];

let blocks = [];
let rightSliceAngle;

function setup() {
  createCanvas(1260, 700);

  for(var i=0; i<100; i++) {
    blocks[i] = {cutAngle: int(random(8)), time: i*20 + 200};
  }

  // Initialize the x and y points of the wrists
  for (var i = 0; i < 2; i++) {
    wrists[i] = { x: 0, y: 0 };
    prev[i] = { x: 0, y: 0 };
  }

  setupPoseDetectionPart();
}

function setupPoseDetectionPart() {
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  let pose = new Pose({
    locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
  });
  pose.setOptions({
    modelComplexity: 0,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  pose.onResults(predict);

  let videoElement = document.getElementsByTagName("video")[0];
  let camera = new Camera(videoElement, {
    onFrame: async () => {
      await pose.send({ image: videoElement });
    },
    width: 640,
    height: 480
  });
  camera.start();

  videoElement.style.display = "none";
}







function predict(results) {
  // The keypoints in the current pose
  let points = results.poseLandmarks;
  if (points == null) return;

  prev[0] = { x: wrists[0].x, y: wrists[0].y };
  prev[1] = { x: wrists[1].x, y: wrists[1].y };

  // Initialize the x and y points of the wrists
  for (var i = 0; i < 2; i++) wrists[i] = { x: 0, y: 0 };

  // wrists
  wrists[0].x += points[15].x;
  wrists[0].y += points[15].y;
  wrists[1].x += points[16].x;
  wrists[1].y += points[16].y;

  // thumbs
  wrists[0].x += points[21].x;
  wrists[0].y += points[21].y;
  wrists[1].x += points[22].x;
  wrists[1].y += points[22].y;

  // pinkies
  wrists[0].x += points[17].x;
  wrists[0].y += points[17].y;
  wrists[1].x += points[18].x;
  wrists[1].y += points[18].y;

  // average
  wrists[0].x /= 3;
  wrists[0].y /= 3;
  wrists[1].x /= 3;
  wrists[1].y /= 3;

  // The coordinates are represented as values from 0-1, 
  // so we need to scale them up and flip them horizontally to be in the correct position
  for (let i = 0; i < wrists.length; i++) {
    wrists[i].x = (1 - wrists[i].x) * video.width;
    wrists[i].y *= video.height;
  }
}

function draw() {
  background(255);

  // If there is a webcam feed available, draw it on the screen
  push();
  translate(video.width / 2, video.height / 2);
  scale(-1, 1);
  imageMode(CENTER);
  image(video, 0, 0);
  pop();

  if (wrists[0] != null) {
      for (var i = 0; i < 2; i++) {

        if (i == 0) stroke(255, 0, 0);
        else stroke(0, 0, 255);

        strokeWeight(1);
        line(wrists[i].x, wrists[i].y, prev[i].x, prev[i].y);

        strokeWeight(20);
        point(wrists[i].x, wrists[i].y);

        let currentVec = createVector(wrists[i].x, wrists[i].y);
        let prevVec = createVector(prev[i].x, prev[i].y);
        let direction = currentVec.sub(prevVec);

        if (direction.mag() > 20) {
          let angle = direction.heading();

          let slicingAngle = round(angle / QUARTER_PI) * QUARTER_PI;
          if (slicingAngle < 0) slicingAngle += TWO_PI;

          if(i == 1) rightSliceAngle = slicingAngle;

          strokeWeight(10);
          push();
          translate(video.width + (i + 1) * 100, height / 4);
          rotate(slicingAngle);
          line(-50, 0, 50, 0);
          line(40, -10, 50, 0);
          line(40, 10, 50, 0);
          pop();
        }
      }

    // clockwise order of IDs: 3, 7, 1, 6, 2, 4, 0, 5, (dot) 8
  }

  var acceptance = 20;
  fill(255,255,0,100);
  noStroke();
  rectMode(CENTER);
  rect(video.width + 400, height/4, 150, acceptance*2);

  for(var i=0; i<blocks.length; i++) {
    var y = blocks[i].time - frameCount;
    y*= 3;

    stroke(0,255,0);
    strokeWeight(5);
    push();
    translate(video.width + 400, height/4 + y);
    rotate(blocks[i].cutAngle*QUARTER_PI);
    line(-30, 0, 30, 0);
    line(20, -10, 30, 0);
    line(20, 10, 30, 0);
    strokeWeight(10);
    point(0,0);
    pop();

    // If the current block is close enough
    if(y > -acceptance && y < acceptance) {
      // If the right saber is slicing in the direction of the current block, remove it from the list
      if(blocks[i].cutAngle*QUARTER_PI == rightSliceAngle) {
        blocks.shift();
      }
    }
  }
}