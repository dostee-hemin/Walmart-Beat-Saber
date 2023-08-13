class MainMenuScene extends Scene {
    constructor() {
        super();

        // Button to enter the calibration scene
        this.calibrateButton = new Button();
        this.calibrateButton.locate(-100,0);
        this.calibrateButton.text = "Calibrate Camera";
        this.calibrateButton.textColor = "#000000";
        this.calibrateButton.onHover = function () {
            this.color = "#AAAAAA";
        }
        this.calibrateButton.onOutside = function () {
            this.color = "#888888";
        }
        this.calibrateButton.onPress = function() {
            this.color = "#FFFFFF";
            nextScene = new CalibrationScene();
        }

        // Button to enter the game scene
        this.enterGameButton = new Button();
        this.enterGameButton.locate(100,0);
        this.enterGameButton.text = "Enter Level";
        this.enterGameButton.textColor = "#000000";
        this.enterGameButton.onHover = function () {
            this.color = "#AAAAAA";
        }
        this.enterGameButton.onOutside = function () {
            this.color = "#888888";
        }
        this.enterGameButton.onPress = function() {
            this.color = "#FFFFFF";
            nextScene = new GameScene();
        }
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
        translate(0,0,-300);
        fill(200);
        noStroke(0);
        plane(cursorZone.width,cursorZone.height);

        this.calibrateButton.display();
        this.enterGameButton.display();
        
        pop();

    }

    update() {
        interactWithPanel();
    }
}