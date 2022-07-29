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
}