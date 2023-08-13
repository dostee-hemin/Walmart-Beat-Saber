let armReachX = 460, armReachY = 305;    // Represents the dimensions of the detection grid

class CalibrationScene extends Scene {
    constructor() {
        super();

        this.calibrationStartFrame = frameCount; // The starting frame from which the user has held the correct calibration position
        this.timeUntilCalibtation = 60;          // The amount of frames required for the user to hold the calibration position until it is accepted

        armReachX = 0;
        armReachY = 0;
    }

    end() {}

    display() {
        push();
        translate(0, 0, -800);

        // Draw the webcam feed
        push();
        scale(-1, 1);
        imageMode(CENTER);
        image(video, 0, 0);
        pop();

        // Draw the detection grid
        stroke(255);
        strokeWeight(3);
        noFill();
        for (let row = -1; row <= 1; row++) {
            for (let column = -1.5; column <= 1.5; column++) {
                let x = column * armReachX / 4;
                let y = row * armReachY / 3;

                rectMode(CENTER);
                rect(x, y, armReachX / 4, armReachY / 3);
            }
        }

        // Provide instructions for how to do the calibration
        fill(255);
        textSize(60);
        textAlign(CENTER);
        if (armReachX == 0) text("Stretch out your arms horizontally", 0, -video.height / 2 - 100);
        else if(armReachY == 0) text("Stretch out your arms diagonally", 0, -video.height / 2 - 100);
        else text("Stand still to enter main menu", 0, -video.height / 2 - 100);

        // Only show the calibration loading bar if we have detected poses and we're not leaving the calibration scene
        if(wrists[0].x != 0 && nextScene == null) {
            let timeSpentStandingStill = frameCount - this.calibrationStartFrame;
            fill(0,200,0);
            noStroke();
            rectMode(CORNER);
            rect(-200,-video.height / 2 - 60,map(timeSpentStandingStill, 0, this.timeUntilCalibtation, 0, 400), 40);
            noFill();
            stroke(255);
            strokeWeight(3);
            rect(-200,-video.height / 2 - 60,400, 40,5);
        }

        // Once we have the dimensions of the detection grid, detect slash movements
        if (armReachX != 0 && armReachY != 0) detectSlashMovement();

        pop();
    }

    update() {
        // Only start calibrating once we have properly entered the scene
        if(transitionFade != 0) {
            this.calibrationStartFrame = frameCount;
            return;
        }

        // If we have not detected poses, leave the function
        if(wrists[0].x == 0) return;

        // If either of the user's hands moves, reset the calibration time
        for(let saber=0; saber<2; saber++) {
            // A vector that represents the path traveled from the previous wrist position to the current one
            let pathTraveled = p5.Vector.sub(wrists[saber], prev[saber]);

            if(pathTraveled.mag() > 10) this.calibrationStartFrame = frameCount;
        }

        // Calibrate only once the user has remained stationary for some time
        if(frameCount - this.calibrationStartFrame >= this.timeUntilCalibtation) {
            if(armReachX == 0) armReachX = abs(wrists[0].x-wrists[1].x)*0.8;
            else if(armReachY == 0) armReachY = abs(wrists[0].y-wrists[1].y);
            else nextScene = new MainMenuScene();

            this.calibrationStartFrame = frameCount;
        }
    }
}