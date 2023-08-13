class LevelFailedScene extends Scene {
    constructor() {
        super();

        // Button to restart the level
        this.restartButton = new Button();
        this.restartButton.locate(-100,0);
        this.restartButton.text = "Restart";
        this.restartButton.textColor = "#000000";
        this.restartButton.onHover = function () {
            this.color = "#AAAAAA";
        }
        this.restartButton.onOutside = function () {
            this.color = "#888888";
        }
        this.restartButton.onPress = function() {
            this.color = "#FFFFFF";
            nextScene = new GameScene();
        }

        // Button to enter the main menu scene
        this.enterMainMenuButton = new Button();
        this.enterMainMenuButton.locate(100,0);
        this.enterMainMenuButton.text = "Main Menu";
        this.enterMainMenuButton.textColor = "#000000";
        this.enterMainMenuButton.onHover = function () {
            this.color = "#AAAAAA";
        }
        this.enterMainMenuButton.onOutside = function () {
            this.color = "#888888";
        }
        this.enterMainMenuButton.onPress = function() {
            this.color = "#FFFFFF";
            nextScene = new MainMenuScene();
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

        fill(0);
        textSize(40);
        textAlign(CENTER,CENTER);
        text("Level Failed", 0, -100);

        this.restartButton.display();
        this.enterMainMenuButton.display();
        pop();

    }

    update() {
        interactWithPanel();
    }
}