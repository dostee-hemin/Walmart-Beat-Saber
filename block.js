let blocksize = 50;     // The size of the note block (in pixels)

// Class for the note blocks
class Block {
    constructor(column, row, color, dir, time) {
        // Rows start from 0 at the bottom, columns start from 0 at the left
        this.row = row;
        this.column = column;

        // Stores an integer representing the selected color (0=red, 1=blue)
        this.color = color;

        // Stores an integer representing the orientation (0=down, 1=down_left, ..., 7=down_right, 8=dot)
        this.dir = dir;

        // Stores the time in seconds the block should be slashed once the music starts
        this.time = time;

        // Store the current and desired rotation of the note block
        this.angle = HALF_PI;
        this.targetAngle = ((this.dir > 4) ? this.dir - 8 : this.dir) * QUARTER_PI + HALF_PI;

        // Initialize the block at the correct column, at the floor, far far away
        this.x = (this.column - 1.5) * blocksize * 1.6;
        this.y = blocksize * 2.4;
        this.startingZ = -1200;          // Determines when the block will adjust to the correct position and orientation
        this.z = 0;

        // Figure out where the coordinates of the block should be based on the row and column
        this.targetX = this.x;
        this.targetY = -(this.row - 1) * blocksize * 1.3;

        // Initialize the block with no size (so that it can grow over time)
        this.size = 0;

        // Helps prevent the block from being sliced twice after it has already been sliced incorrectly
        this.canBeSliced = true;
        // Helps remove the current block object once it has been sliced
        this.isSliced = false;
        // Stores the number of shakes left for the given block to portray a failed slice
        this.shakeCounter = 0;
    }

    display() {
        // If the block is too far away, leave don't draw it
        if(this.z < -visibleTimeSecond*scalingFactor) return;

        stroke(0);

        // Assign the correct color
        if (this.color == 0) fill(255, 0, 0);
        else fill(0, 0, 255);

        push();
        translate(this.x, this.y, this.z);
        if (this.dir != 8) rotateZ(this.angle);
        // Add some shakiness if there is any
        if(this.shakeCounter > 0) {
            rotateZ(random(-0.3,0.3));
            this.shakeCounter--;
        }
        // Block
        box(this.size, this.size, this.size);

        // Arrow
        fill((this.z < slashAcceptancePoint) ? 150 : 255);
        noStroke();
        // Draw an arrow if the block is not a dot block
        if (this.dir < 8) {
            push();
            translate(-this.size * 0.25, 0, this.size * 0.5);
            box(this.size * 0.2, this.size * 0.8, 2);
            pop();
            push();
            translate(-this.size * 0.15, 0, this.size * 0.5);
            box(this.size * 0.2, this.size * 0.6, 2);
            pop();
            push();
            translate(-this.size * 0.05, 0, this.size * 0.5);
            box(this.size * 0.2, this.size * 0.4, 2);
            pop();
        } 
        // Draw an dot if the block is not a dot block
        else {
            push();
            translate(0, 0, this.size * 0.5);
            box(this.size * 0.4, this.size * 0.4, 2);
            pop();
        }

        pop();
    }

    update() {
        // Move the block towards the player
        this.z = -(this.time + levelStartSecond + startDelaySecond - millis()/1000) * scalingFactor;

        // If the player has failed, shrink the blocks
        if(healthRemaining == 0) {
            this.size--;
            if(this.size < 0) this.size = 0;
        } 
        // If the block has just started entering the scene, grow the blocks
        else if(this.z < this.startingZ) {
            this.size = map(abs(this.z - this.startingZ), abs(this.startingZ), 0, 0, blocksize);
        }
        
        // If the block should start adjusting its orientation, move it to the correct height and rotation
        if (this.z > this.startingZ) {
            this.y = lerp(this.y, this.targetY, 0.1);
            this.angle = lerp(this.angle, this.targetAngle, 0.1);
        } 
        
    }

    // Return true if the block is too far behind the player
    isFinished() {
        return this.z > 300;
    }

    // Return whether or not the block has been sliced
    hasBeenSliced() {
        return this.isSliced;
    }

    // Create two new sliced blocks at the current block's location with the given angle
    sliceCorrectly(ang) {
        slicedBlocks.push(new SlicedBlock(this.x, this.y, this.z, ang, this.color, -1, (this.dir==8)));
        slicedBlocks.push(new SlicedBlock(this.x, this.y, this.z, ang, this.color, 1, (this.dir==8)));
        this.isSliced = true;
    }

    // Make the block shake and prevent it from being sliced again
    sliceIncorrectly() {
        this.canBeSliced = false;
        this.shakeCounter = 10;
    }
}

class SlicedBlock {
    constructor(x, y, z, angle, color, side, isDot) {
        // Stores all x, y, and z rotations the block should be at
        this.targetAngle = createVector(0,0,angle);
        // Stores how the x, y, and z angles should change over time
        this.angleVel = createVector(random(-0.02,0.02),random(0.06),0);
        // Determines how to draw the arrow
        this.isDot = isDot;

        // Assign the sliced block a location and a velocity in the direction of the slicing angle
        this.loc = createVector(x, y, z);
        this.vel = p5.Vector.fromAngle(this.targetAngle.z + random(PI / 4) * side).mult(random(1, 3));

        // Stores all x, y, and z rotations the block is currently at
        this.angle = this.targetAngle;
        if(isDot) this.angle = createVector(0,0,0);

        // Set the color, side (left "-1" or right "+1"), and size
        this.color = color;
        this.side = side;
        this.size = blocksize;

        // Give the sliced block a certain number of frames to exist
        this.lifetime = 100;
    }

    display() {
        // Set the correct color of the sliced block
        if (this.color == 0) fill(255, 0, 0);
        else fill(0, 0, 255);
        push();
        translate(this.loc.x, this.loc.y, this.loc.z);
        rotateZ(this.angle.z);
        rotateX(this.angle.x);
        rotateY(this.angle.y);

        // Block
        translate(0, this.size * 0.25 * this.side, 0);
        box(this.size, this.size * 0.5, this.size);

        // Arrow
        noStroke();
        fill(255);
        // Draw half of an arrow if the block is not a dot block
        if (!this.isDot) {
            push();
            translate(-this.size * 0.25, this.size * -0.05 * this.side, this.size * 0.5);
            box(this.size * 0.2, this.size * 0.4, 2);
            pop();
            push();
            translate(-this.size * 0.15, this.size * -0.10 * this.side, this.size * 0.5);
            box(this.size * 0.2, this.size * 0.3, 2);
            pop();
            push();
            translate(-this.size * 0.05, this.size * -0.15 * this.side, this.size * 0.5);
            box(this.size * 0.2, this.size * 0.2, 2);
            pop();
        } 
        // Draw half of a dot if the block is a dot block
        else {
            push();
            translate(0, this.size * -0.125 * this.side, this.size * 0.5);
            box(this.size * 0.4, this.size * 0.2, 2);
            pop();
        }
        pop();
    }

    update() {
        // Apply basics physics to the block
        this.vel.add(gravity);
        this.loc.add(this.vel);

        // Move the block towards the player
        this.loc.z += 5;

        // Update the rotation angles
        this.targetAngle.add(this.angleVel);
        this.angle.lerp(this.targetAngle, 0.1);

        // Every frame, the block has less and less frames left to exist
        this.lifetime--;

        // After a while, start shrinking the sliced block
        if (this.lifetime <= 60) {
            this.size = (this.lifetime / 60) * blocksize;
        }
    }

    // Returns true if the sliced block has no frames left to exist
    isFinished() {
        return this.lifetime <= 0;
    }
}