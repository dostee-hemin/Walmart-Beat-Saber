class MainMenuScene extends Scene {
    constructor() {
        super();
    }

    end() {}

    display() {
        // Draw the central platform the player stands on
        push();
        translate(0, 200, 0);
        fill(255);
        rotateX(HALF_PI);
        plane(300, 300);
        fill(255, 0, 0);
        sphere(20);
        pop();

        // Draw the menu panel
        push();
        translate(0,0,-100);
        fill(200);
        noStroke(0);
        plane(100,50);
        pop();
    }

    update() {
        interactWithPanel();
    }
}