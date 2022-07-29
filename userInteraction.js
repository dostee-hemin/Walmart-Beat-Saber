let headOrientation = [];  // Stores the translation and rotation of the player's head in 3D space

let rotationSensitivity = 0.2;      // How quickly the player's head rotates
let rotationPrecision = 0.03;       // How small of an angle the rotation snaps to
let translationSensitivity = 0.1    // How quickly the player moves around the scene

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

    if(mouth[0].x != 0) {
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