let headOrientation = [];  // Stores the translation and rotation of the player's head in 3D space

let rotationSensitivity = 0.2;      // How quickly the player's head rotates
let rotationPrecision = 0.03;       // How small of an angle the rotation snaps to
let translationSensitivity = 0.1    // How quickly the player moves around the scene

let hasClicked = false;             // Prevents continuous clicking on the panel
let cursorSize = 8;                 // The size of the clicking area of the cursor
let cursor = [{x: 0, y: 0}, {x: 0, y: 0}];      // The two wrist positions mapped onto the UI panel
let rightCursorClicked = false;                 // Represents which cursor clicked (left = false, right = true)
let cursorZone = {width: 500, height: 400};     // The dimensions of the UI panel where the cursor can exist

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
        // Calculate the distance between the thumbs and the wrists
        var distHands = [thumbs[0].y-wrists[0].y, thumbs[1].y-wrists[1].y];
        let threshold = armReachX/50;

        // If the player hasn't clicked on the panel yet
        if(!hasClicked) {
            // If the player clicks (by rotating their hands), click on the panel
            if((distHands[0] > -threshold && distHands[0] < 0) || (distHands[1] > -threshold && distHands[1] < 0)) {
                clickOnPanel();
                hasClicked = true;
                rightCursorClicked = distHands[1] > -threshold;
            }
        } 
        // Once the player has clicked, wait till they rotate their hands away before clicking again
        else if((distHands[0] < -threshold || distHands[0] > 0) && !rightCursorClicked) hasClicked = false;
        else if((distHands[1] < -threshold || distHands[1] > 0) && rightCursorClicked) hasClicked = false;

        // Loop through both wrists
        for(var i=0; i<2; i++) {
            // Calculated the mapped wrist position on the panel
            cursor[i].x = (wrists[i].x-(video.width/2))/(video.width/4) * cursorZone.width/2;
            cursor[i].y = (wrists[i].y-(video.height/2))/(video.height/4) * cursorZone.height/2;

            // If the cursor is out of bounds, don't display it
            if(cursor[i].x < -cursorZone.width/2 || cursor[i].x > cursorZone.width/2 || cursor[i].y < -cursorZone.height/2 || cursor[i].y > cursorZone.height/2) 
                continue;

            // Translate to the cursor position and display
            push();
            translate(cursor[i].x,cursor[i].y,-299);
            // Choose the color of the cursor based on whether or not the player has selected something
            if(hasClicked && ((i==0 && !rightCursorClicked) || (i==1 && rightCursorClicked))) fill(0,200,0);
            else fill(200,0,0);
            noStroke();
            ellipse(0,0,cursorSize,cursorSize);
            pop();
        }
    }
}

function clickOnPanel() {
    // Do something
}