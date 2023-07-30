let blocks = [];                         // Stores all the note blocks that come at the player
let slicedBlocks = [];                   // Stores the sliced version of the note blocks for effect
let gravity;                             // A vector that points downards to add a falling motion to the sliced blocks
let showMenu;                            // Determines whether or not we can display and interct with the menu panel

class GameScene extends Scene {
    constructor() {
        super();
    }

    end() {
        blocks = []
        slicedBlocks = [];
    }

    load() {
        showMenu = false;
        gravity = createVector(0, 0.2, 0);
    }

    display() {
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
        fill(255, 0, 0);
        sphere(20);
        pop();

        // Show the note and sliced blocks
        blocks.forEach(block => {
            block.display();
        });
        slicedBlocks.forEach(block => {
            block.display();
        });

        // Draw the menu panel
        if (showMenu) {
            push();
            translate(0, 0, -100);
            fill(200);
            plane(100, 50);
            pop();
        }

    }

    update() {
        // Every few frames, add another note block just for testing purposes
        if(frameCount % 60 == 0) {
            blocks.push(new Block(int(random(4)), int(random(3)), int(random(2)), int(random(9))));
        }
        
        // Update and remove note blocks
        for (var i = blocks.length - 1; i >= 0; i--) {
            let b = blocks[i];

            b.update();
            if (b.isFinished()) blocks.splice(i, 1);
        }


        // Update and remove sliced blocks
        for (var i = slicedBlocks.length - 1; i >= 0; i--) {
            let s = slicedBlocks[i];

            s.update();
            if (s.isFinished()) slicedBlocks.splice(i, 1);
        }

        // Interact with the panel if it is visible
        if(showMenu) interactWithPanel();
    }
}