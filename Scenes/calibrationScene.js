let armReachX, armReachY;    // Represents the dimensions of the detection grid

class CalibrationScene extends Scene {
    constructor() {
        super();
    }

    end() {}

    load() {
        armReachX = 0;
        armReachY = 0;
    }

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

        // Show the framecount until frame 500 
        if (frameCount <= 500) {
            fill(255);
            textSize(60);
            text(frameCount, 0, -video.height / 2 - 100);
        }

        pop();
    }

    update() {
        // Assign the detection grid dimensions based on the distance between the wrists at the appropriate frames
        if(frameCount == 400) armReachX = abs(wrists[0].x-wrists[1].x)*0.8;
        else if (frameCount == 500) armReachY = abs(wrists[0].y-wrists[1].y);

        // Once we have the dimensions of the detection grid, start detecting slash movements
        if (armReachX != 0 && armReachY != 0) detectSlashMovement();
    }
}