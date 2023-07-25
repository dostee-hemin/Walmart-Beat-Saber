let virtualCamera;                   // Represents the camera object that the p5 sketch uses to render the scene

let showMenu = false;      // Determines whether or not we can display and interct with the menu panel

function setup() {
  // Create a canvas that fills the screen and is in 3D
  createCanvas(1260, 700, WEBGL);

  // Initialize the orientation of the player's head at the default values
  headOrientation = { posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0 };

  // Create the camera object and assign it to our scene
  virtualCamera = createCamera();
  setCamera(virtualCamera);

  setupBeatSaberPart();

  // Setup the part of the program that handles pose detection
  setupPoseDetectionPart();
}

function draw() {
  background(0);

  // Every few frames, add another note block just for testing purposes
  if(frameCount % 60 == 0) {
    blocks.push(new Block(int(random(4)), int(random(3)), int(random(2)), int(random(9))));
  }

  // Move the camera to the current position according to the player head's orientation
  virtualCamera.setPosition(0, 0, 0);
  rotateHead();
  translateHead();

  // Draw the floor the blocks will be coming from
  noStroke();
  push();
  translate(0, 200, -900);
  fill(100);
  rotateX(HALF_PI);
  plane(400, 1500);
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
  translate(0, 200, 0);
  fill(255);
  rotateX(HALF_PI);
  plane(300, 300);
  fill(255,0,0);
  sphere(20);
  pop();
  
  // Draw the menu panel
  if(showMenu) {
    push();
    translate(0,0,-100);
    fill(200);
    plane(100,50);
    pop();

    interactWithPanel();
  }

  updateGameElements();
}