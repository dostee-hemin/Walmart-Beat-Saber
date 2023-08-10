//Determines if the mouse was pressed on the previous frame
var cursorWasPressed = false;
//Last hovered button
var lastHoveredButton = null;
//Last pressed button
var lastClickedButton = null;
//All created buttons
var allButtons = [];

//This function is what makes the magic happen and should be ran after each draw cycle.
p5.prototype.runGUI = function () {
	for (i = 0; i < allButtons.length; ++i) {
		if (lastHoveredButton != allButtons[i])
			allButtons[i].onOutside();
	}
	if (lastHoveredButton != null) {
		if (lastClickedButton != lastHoveredButton) {
			lastHoveredButton.onHover();
		}
	}
	if (!cursorWasPressed && lastClickedButton != null) {
		lastClickedButton.onPress();
	}
	if (cursorWasPressed && !hasClicked && lastClickedButton != null) {
		if (lastClickedButton == lastHoveredButton) {
			lastClickedButton.onRelease();
		}
		lastClickedButton = null;
	}
	lastHoveredButton = null;
	cursorWasPressed = hasClicked;
}

p5.prototype.registerMethod('post', p5.prototype.runGUI);

//This function is used to get the bounding size of a
//string of text for use in the 'textScaled' property
function getTextBounds(m, font, size) {
	let txt = document.createElement("span");
	document.body.appendChild(txt);

	txt.style.font = font;
	txt.style.fontSize = size + "px";
	txt.style.height = 'auto';
	txt.style.width = 'auto';
	txt.style.position = 'absolute';
	txt.style.whiteSpace = 'no-wrap';
	txt.innerHTML = m;

	let width = Math.ceil(txt.clientWidth);
	let height = Math.ceil(txt.clientHeight);
	document.body.removeChild(txt);
	return [width, height];
}

//Button Class
class Button {
    constructor() {
        this.x = 0;			//X position of the button
        this.y = 0;			//Y position of the button
        this.width = 100;		//Width of the button
        this.height = 50;		//Height of the button
        this.color = "#FFFFFF";		//Background color of the button
        this.cornerRadius = 10;		//Corner radius of the button
        this.strokeWeight = 2;		//Stroke width of the button
        this.stroke = "#000000";	//Border color of the button
        this.text = "Press Me";		//Text of the button
        this.textColor = "#000000";	//Color for the text shown
        this.textSize = 12;		//Size for the text shown
        this.textFont = null;	//Font for the text shown
        this.textScaled = false;     //Scale the text with the size of the button
        
        // image options
        this.image = null; // image object from p5loadimage()
        this.fitImage = false; // when true, image will stretch to fill button
        this.imageScale = 1.0;
        this.tint = null; // tint image using color
        this.noTint = true; // default to disable tinting
        this.filter = null; // filter effect

        this.updateTextSize();
        allButtons.push(this);
    }

	updateTextSize() {
		if (this.textScaled) {
			for (let i = this.height; i > 0; i--) {
				if (getTextBounds(this.text, this.textFont, i)[0] <= this.width
					&& getTextBounds(this.text, this.textFont, i)[1] <= this.height) {
					console.log("textbounds: " + getTextBounds(this.text, this.font, i));
					console.log("boxsize: " + this.width + ", " + this.height);
					this.textSize = i / 2;
					break;
				}
			}
		}
	}

	onHover() {
		//This function is ran when the button is hovered but not pressed.
	}

	onOutside() {
		//This function is ran when the button is NOT hovered.
	}

	onPress() {
		//This function is ran when the button is pressed.
	}

	onRelease() {
		//This function is ran when the cursor was pressed and then
		//released inside the button. If it was pressed inside and
		//then released outside this won't run.
	}

	locate(x, y) {
		this.x = x;
		this.y = y;
	}

	resize(w, h) {
		this.width = w;
		this.height = h;
		this.updateTextSize();
	}

	displayImage(){
		push();
		imageMode(CENTER);
		let centerX = this.x + this.width / 2;
		let centerY = this.y + this.height / 2;
		let imgWidth = this.width;
		let imgHeight = this.height;
		if(this.fitImage){
			let imageAspect = this.image.width / this.image.height;
			let buttonAspect = this.width / this.height;
			if(imageAspect > buttonAspect){ // image is wider than button
				imgWidth = this.width;
				imgHeight = this.height * (buttonAspect / imageAspect);
			}
			else{
				imgWidth = this.width * (imageAspect / buttonAspect);
				imgHeight = this.height;
			}
		}
		
		image(this.image, centerX, centerY, imgWidth * this.imageScale, imgHeight * this.imageScale);
        
		if(this.tint && !this.noTint){
			tint(this.tint)
		} else {
			noTint();
		}
		if(this.filter){
			filter(this.filter);
		}
		pop();
	}

	display(){
		push();
		fill(this.color);
		stroke(this.stroke);
		strokeWeight(this.strokeWeight);
		rectMode(CENTER);
		rect(this.x, this.y, this.width, this.height, this.cornerRadius);
		fill(this.textColor);
		noStroke();
		if(this.image){
			this.displayImage();
		}
		textAlign(CENTER, CENTER);
		textSize(this.textSize);
		if(this.textFont != null) textFont(this.textFont);
		text(this.text, 0, 0);
		if(wrists[0].x != 0) {
			if ((pointer[0].x >= this.x - this.width/2 && pointer[0].y >= this.y - this.height/2 &&
				pointer[0].x < this.x + this.width/1 && pointer[0].y < this.y + this.height/2) ||
				(pointer[1].x >= this.x - this.width/2 && pointer[1].y >= this.y - this.height/2
				&& pointer[1].x < this.x + this.width/1 && pointer[1].y < this.y + this.height/2)) {
				lastHoveredButton = this;
				if (hasClicked && !cursorWasPressed)
					lastClickedButton = this;
			}
		}
		pop();
	}
}