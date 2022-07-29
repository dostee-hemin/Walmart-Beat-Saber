let cam;                   // Represents the camera object that the p5 sketch uses to render the scene
let headOrientation = [];  // Stores the translation and rotation of the player's head in 3D space

let rotationSensitivity = 0.2;  // How quickly the player's head rotates
let rotationPrecision = 0.03;   // How small of an angle the rotation snaps to

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
  
  rotateHead();
  translateHead();

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