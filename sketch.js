let cam;  // Represents the camera object that the p5 sketch uses to render the scene
let headOrientation = [];  // Stores the translation and rotation of the player's head in 3D space

function setup() {
  // Create a canvas that fills the screen and is in 3D
  createCanvas(1260, 700, WEBGL);

  // Initialize the orientation of the player's head at the default values
  headOrientation = { posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0 };

  // Create the camera object and assign it to our scene
  cam = createCamera();
  setCamera(cam);

  // Setup the part of the program that handles pose detection
  setupPoseDetectionPart();
}

function draw() {
  background(0);

  // Move the camera to the current position according to the player head's orientation
  cam.setPosition(0, 0, 0);
  rotateX(headOrientation.rotX);
  rotateZ(headOrientation.rotZ);
  rotateY(headOrientation.rotY);
  translate(headOrientation.posX, headOrientation.posY, headOrientation.posZ);
  headOrientation.rotX = (mouseY - height / 2) / (height / 2) * -PI / 3;
  headOrientation.rotY = (mouseX - width / 2) / (width / 2) * HALF_PI;

  // Draw the floor the blocks will be coming from
  noStroke();
  push();
  translate(0, 100, -700);
  fill(100);
  rotateX(HALF_PI);
  plane(300, 1000);
  pop();
  
  // Draw two walls of next to the floor
  push();
  translate(-300, 0, -700);
  fill(50);
  rotateY(HALF_PI);
  plane(1000, 1000);
  pop();
  push();
  translate(300, 0, -700);
  fill(50);
  rotateY(HALF_PI);
  plane(1000, 1000);
  pop();
  
  // Draw the central platform the player stands on
  push();
  translate(0, 100, 0);
  fill(255);
  rotateX(HALF_PI);
  plane(300, 300);
  fill(255,0,0);
  sphere(20);
  pop();
  
  // Draw the menu panel
  push();
  translate(0,0,-100);
  fill(200);
  plane(100,50);
  pop();
}

// Crude implementation of motion using key inputs. The keys control the player's orientation
function keyPressed() {
  switch (key) {
    case 'd':
      headOrientation.posX -= 2;
      break;
    case 'a':
      headOrientation.posX += 2;
      break;
    case 's':
      headOrientation.posZ -= 2;
      break;
    case 'w':
      headOrientation.posZ += 2;
      break;
    case 'z':
      headOrientation.posY -= 2;
      break;
    case 'x':
      headOrientation.posY += 2;
      break;
  }
}