let headOrientation = [];  // Stores the translation and rotation of the player's head in 3D space

let rotationSensitivity = 0.2;      // How quickly the player's head rotates
let rotationPrecision = 0.03;       // How small of an angle the rotation snaps to
let translationSensitivity = 0.1    // How quickly the player moves around the scene

let hasClicked = false;             // Prevents continuous clicking on the panel
let pointerSize = 8;                // The size of the clicking area of the pointer

function rotateHead() {
    rotateX(headOrientation.rotX);
    rotateY(headOrientation.rotY);
    rotateZ(headOrientation.rotZ);

    // If we have detected some face points...
    if (mouth[0].x != 0) {
        // Looking up and down
        var RtoL = p5.Vector.sub(ears[0], ears[1]);
        var NosetoL = p5.Vector.sub(ears[0], nose);
        var angle = NosetoL.angleBetween(RtoL) + 0.25;
        angle = round(angle / rotationPrecision) * rotationPrecision

        headOrientation.rotX = lerp(headOrientation.rotX, angle, rotationSensitivity);

        // Looking left and right
        var LtoNose = p5.Vector.sub(nose, ears[0]);
        var LtoR = p5.Vector.sub(ears[1], ears[0]);
        var proj = LtoR.copy().mult(LtoNose.dot(LtoR) / pow(LtoR.mag(), 2));
        angle = map(proj.mag(), 0, LtoR.mag(), -PI / 3, PI / 3) - 0.03;
        angle = round(angle / rotationPrecision) * rotationPrecision;

        headOrientation.rotY = lerp(headOrientation.rotY, angle, rotationSensitivity);

        // Tilting side to side
        var dir = p5.Vector.sub(mouth[1], mouth[0]);
        angle = dir.heading() - 0.03;
        angle = round(angle / rotationPrecision) * rotationPrecision;

        headOrientation.rotZ = lerp(headOrientation.rotZ, -angle, rotationSensitivity);
    }
}

function translateHead() {
    translate(headOrientation.posX, headOrientation.posY, headOrientation.posZ);

    if(ears[0].x != 0) {
        // Moving left and right
        var target = (nose.x-video.width/2)/(video.width/2) * -150;
        headOrientation.posX = lerp(headOrientation.posX,target,translationSensitivity);
        
        // Moving up and down
        target = (nose.y-video.height/2)/(video.height/2) * -70;
        target -= headOrientation.posZ/200 * 70;
        headOrientation.posY = lerp(headOrientation.posY,target,translationSensitivity);

        // Moving back and forth
        var LtoR = p5.Vector.sub(ears[0],ears[1]);
        headOrientation.posZ = lerp(headOrientation.posZ,map(LtoR.mag(),5,200,-50,200),translationSensitivity);
    }
}

function interactWithPanel() {
    if(wrists[0].x != 0) {
        // Calculate the distance between the two wrists
        var distWrists = dist(wrists[0].x,wrists[0].y,wrists[1].x,wrists[1].y);

        // If the player hasn't clicked on the panel yet
        if(!hasClicked) {
            // If the player clicks (by overlapping their wrists), click on the panel
            if(distWrists < pointerSize*2) {
                clickOnPanel();
                hasClicked = true;
            }
        } 
        // Once the player has clicked, wait till they move their wrists away before clicking again
        else if(distWrists > pointerSize*2) hasClicked = false;

        // Loop through both wrists
        for(var i=0; i<2; i++) {
            // Calculated the mapped wrist position on the panel
            var pointerX = (wrists[i].x-nose.x)/(video.width/4) * 100;
            var pointerY = (wrists[i].y-nose.y)/(video.height/4) * 50;

            // If the pointer is out of bounds, don't display it
            if(pointerX < -50 || pointerX > 50 || pointerY < -25 || pointerY > 25) 
                continue;

            // Translate to the pointer position and display
            push();
            translate(pointerX,pointerY,-99);
            // Choose the color of the pointer based on whether or not the player has selected something
            if(hasClicked) fill(0,200,0);
            else fill(200,0,0);
            noStroke();
            ellipse(0,0,pointerSize,pointerSize);
            pop();
        }
    }
}

function clickOnPanel() {
    // Do something
}

function keyPressed() {
    // Quick scene navigation for testing purposes
    nextScene = new GameScene();
}