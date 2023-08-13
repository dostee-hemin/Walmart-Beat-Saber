let offAngleThreshold = 0.5;                // Represents how far off (in radians) from the block angle a slash can be for it to still be considered correct 
let slashAcceptancePoint = -300;            // Represents the point the blocks have to pass for them to accept slashes

function checkBlockSlash(saberColor, slashColumn, slashRow, slashAngle) {
    for(let i=0; i<blocks.length; i++) {
        let b = blocks[i];

        // If the block is too far away, ignore it
        if(b.z < slashAcceptancePoint) continue;

        // If the block has already been sliced, ignore it
        if(!b.canBeSliced) continue;
        
        // If the block is not in the position of the current slash, ignore it
        if(b.column != slashColumn || b.row != slashRow) continue;
        
        // If the block color is different from the saber color, that means it's an incorrect slash
        if(b.color != saberColor) {
            b.sliceIncorrectly();
            continue;
        }
        
        // If the block is a dot block, then it is a correct slash so slice it in the direction of the slash
        if(b.dir == 8) {
            b.sliceCorrectly(slashAngle);
            continue;
        }

        // Create two vectors representing the direction of the block and slash
        let v1 = p5.Vector.fromAngle(b.targetAngle);
        let v2 = p5.Vector.fromAngle(slashAngle);


        // If the slash angle is too far off from the block angle, that means it's an incorrect slash
        if(abs(v1.angleBetween(v2)) > offAngleThreshold) {
            b.sliceIncorrectly();
            continue;
        }

        // At this point, we have passed all the checks so it must be a correct slash
        healthRemaining = constrain(healthRemaining+10, 0, 100);
        b.sliceCorrectly(b.targetAngle);
    }
}

function detectSlashMovement() {
    for(let saber=0; saber<2; saber++) {
        // Map the wrist's x and y coordinates to the saber integer grid
        let wristsInGrid = {x: (wrists[saber].x - video.width/2) / (armReachX/4) + 1.5,
                            y: -(wrists[saber].y - video.height/2) / (armReachY/3) + 1};

        // Map the wrist's previous x and y coordinates to the saber integer grid
        let prevInGrid = {x: (prev[saber].x - video.width/2) / (armReachX/4) + 1.5,
                          y: -(prev[saber].y - video.height/2) / (armReachY/3) + 1};
        
        // A vector that represents the path traveled from the previous wrist position to the current one
        let pathTraveled = p5.Vector.sub(wrists[saber], prev[saber]);
        
        // If the path traveled is not large enough to be considered a slash, move on
        if(pathTraveled.mag() < 10) continue;

        // Get the list of cells in the grid that overlap with the path traveled
        let overlappingCells = getOverlappingCells(wristsInGrid, prevInGrid);

        for(let i=0; i<overlappingCells.length; i++) {
            let cell = overlappingCells[i];

            // Determine how this slash will affect the blocks in the grid
            checkBlockSlash(saber, cell.x, cell.y, pathTraveled.heading());

            // Draw the slash in the current cell as an arrow
            let x = (cell.x-1.5) * armReachX/4;
            let y = -(cell.y-1) * armReachY/3;
        
            if(saber == 0) stroke(255,100,0,50);
            else stroke(0,100,255,50);

            push();
            translate(x, y, 0);
            rotate(pathTraveled.heading());
            strokeWeight(10);
            line(-armReachX/8, 0, armReachX/8, 0);
            line(armReachX/8-30,-15,armReachX/8,0);
            line(armReachX/8-30,15,armReachX/8,0);
            pop();
        }
    }
}

function getOverlappingCells(current, previous) {
    // Resulting list of cells that overlap with the path traveled
    let overlappingCells = [];

    let gridCols = 4;
    let gridRows = 3;
  
    // Bresenham's line algorithm
    let dx = current.x - previous.x;
    let dy = current.y - previous.y;
    let steps = abs(dx) > abs(dy) ? abs(dx) : abs(dy);
    let xIncrement = dx / steps;
    let yIncrement = dy / steps;
    let x = previous.x;
    let y = previous.y;
  
    for (let i = 0; i <= steps; i++) {
      let gridX = floor(x + 0.5);
      let gridY = floor(y + 0.5);
  
      if (
        gridX >= 0 &&
        gridX < gridCols &&
        gridY >=  0 &&
        gridY < gridRows
      ) {
        overlappingCells.push(createVector(gridX, gridY));
      }
  
      x += xIncrement;
      y += yIncrement;
    }
  
    return overlappingCells;
}