let virtualCamera;                   // Represents the camera object that the p5 sketch uses to render the scene

function setup() {
  // Create a canvas that fills the screen and is in 3D
  createCanvas(1260, 700, WEBGL);

  // Initialize the orientation of the player's head at the default values
  headOrientation = { posX: 0, posY: 0, posZ: 0, rotX: 0, rotY: 0, rotZ: 0 };

  // Create the camera object and assign it to our scene
  virtualCamera = createCamera();
  setCamera(virtualCamera);

  // Setup the part of the program that handles pose detection
  setupPoseDetectionPart();

  // Set the font of text we'll be using
  textFont(loadFont('Assets/coolvetica rg.otf'));

  currentScene = new MainMenuScene();
  currentScene.load();
}

function draw() {
  background(0);

  // Move the camera to the current position according to the player head's orientation
  virtualCamera.setPosition(0, 0, 0);
  // rotateHead();
  //translateHead();

  currentScene.update();
  currentScene.display();
  
  showTransition();
}