let blocks = [];           // Stores all the note blocks that come at the player
let slicedBlocks = [];     // Stores the sliced version of the note blocks for effect

function setupBeatSaberPart() {
    // Initialize the gravity vector to point downwards
    gravity = createVector(0, 0.2, 0);
}

function updateGameElements() {
    // Loop through all the note blocks
    for (var i = blocks.length - 1; i >= 0; i--) {
        let b = blocks[i];

        // Update the note block
        b.update();
        // If the note block has no more use, remove it from the list
        if (b.isFinished()) blocks.splice(i, 1);
        // Display the note block
        b.display();
    }


    // Loop through all the sliced blocks
    for (var i = slicedBlocks.length - 1; i >= 0; i--) {
        let s = slicedBlocks[i];

        // Update the sliced block
        s.update();
        // If the sliced block has no more use, remove it from the list
        if (s.isFinished()) slicedBlocks.splice(i, 1);
        // Display the sliced block
        s.display();
    }
}