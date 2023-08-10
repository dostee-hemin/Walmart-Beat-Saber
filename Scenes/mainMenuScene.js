class MainMenuScene extends Scene {
    constructor() {
        super();

        // Temporary code for testing out the button
        this.button = new Button();
        this.button.locate(0,0);
        this.button.onHover = function () {
            this.color = "#AAAAFF";
            this.textColor = "#FFFFFF";
            this.text = "Almost there!";
        }
        this.button.onOutside = function () {
            this.color = "#FFFFFF";
            this.textColor = "#000000";
            this.text = "Press me!";
        }
        this.button.onPress = function() {
            this.color = "#FFAAAA";
            this.textColor = "#FFFFFF";
            this.text = "YAY!";
        }
        this.button.onRelease = function() {
            this.color = "#AAFFAA";
            this.textColor = "#FFFFFF";
            this.text = "Goodbye :')";
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

        // Draw the webcam feed
        push();
        translate(0,0,-300);
        scale(-1, 1);
        imageMode(CENTER);
        image(video,0,0, cursorZone.width,cursorZone.height);
        pop();

        // Draw the menu panel
        push();
        translate(0,0,-300);
        // fill(200);
        // noStroke(0);
        //plane(cursorZone.width,cursorZone.height);

        this.button.display();
        
        pop();

    }

    update() {
        interactWithPanel();
    }
}