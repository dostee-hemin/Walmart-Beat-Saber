let currentScene;
let nextScene;

// Variables for animating the transition
let transitionFade = 400;
let transitionFadeSpeed = 5;

function showTransition() {
    // Cover the screen in black when transitioning
    push();
    translate(0,0,-100);
    noStroke();
    fill(0, transitionFade);
    rectMode(CENTER);
    rect(0,0,width,height);
    pop();

    // Make the transition animaiton more opaque or transparent based on if have new a scene to go to
    transitionFade += transitionFadeSpeed * ((nextScene == null) ? -1 : 1);
    transitionFade = constrain(transitionFade, 0, 400);

    // Once the transition animation is pitch black, we can now move on to the next scene
    if(transitionFade == 400) transitionToNextScene();
}

function transitionToNextScene() {
    currentScene.end();
    nextScene.load();

    currentScene = nextScene;
    nextScene = null;
}


