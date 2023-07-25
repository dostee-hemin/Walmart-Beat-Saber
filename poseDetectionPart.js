let video;          // The p5 video feed used to display what the camera sees
let nose;           // Stores the coordinates of the nose of the player
let wrists = [];    // Stores the coordinates of the left and right wrists of the player
let mouth = [];     // Stores the coordinates of the mouth's left and right position
let ears = [];      // Stores the coordinates of the left and right ears of the player
let prev = [];      // Stores the previous coordinates of the wrists to calculate motion

function setupPoseDetectionPart() {
    // Create a new pose detector using the BlazePose model
    let posePredictor = new Pose({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }});
    posePredictor.setOptions({
        modelComplexity: 0,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    // Set the function that will run when we get a pose
    posePredictor.onResults(predict);

    // Get the HTML video element that is our webcam
    let videoElement = document.getElementsByClassName("input_video")[0];
    // Provide the webcam feed to the pose detector
    let camera = new Camera(videoElement, {
        onFrame: async () => {
        await posePredictor.send({image: videoElement});
        },
        width: 640,
        height: 480
    });
    camera.start();

    /*   This code is constructs a p5 Media Element using the existing video HTML tag   */
    const node = this._userNode ? this._userNode : document.body;
    node.appendChild(videoElement);
    const mediaEl = new p5.MediaElement(videoElement, this)
    this._elements.push(mediaEl);
    mediaEl.loadedmetadata = false;

    videoElement.addEventListener('loadedmetadata', () => {
        mediaEl.width = videoElement.videoWidth;
        mediaEl.height = videoElement.videoHeight;

        if (mediaEl.elt.width === 0) mediaEl.elt.width = videoElement.videoWidth;
        if (mediaEl.elt.height === 0) mediaEl.elt.height = videoElement.videoHeight;
        if (mediaEl.presetPlaybackRate) {
        mediaEl.elt.playbackRate = mediaEl.presetPlaybackRate;
        delete mediaEl.presetPlaybackRate;
        }
        mediaEl.loadedmetadata = true;
    });

    video = mediaEl;

    // Disable the HTML video element so that it doesn't interfere with our p5 sketch
    videoElement.style.display = "none";

    // Initialize the x and y points of the wrists
    for (var i = 0; i < 2; i++) {
        wrists[i] = createVector();
        mouth[i] = createVector();
        ears[i] = createVector();
        prev[i] = createVector();
    }
}






// This function is called anytime a pose is detected
function predict(results) {
    // The keypoints in the current pose
    let points = results.poseLandmarks;

    // If there are no points detected, leave the function
    if (points == null) return;

    // Update the previous wrist values to be the current wrist values
    prev[0] = createVector(wrists[0].x, wrists[0].y);
    prev[1] = createVector(wrists[1].x, wrists[1].y);

    for (var i = 0; i < 2; i++) {
        wrists[i] = createVector(0,0);

        mouth[i] = createVector(points[9+i].x, points[9+i].y);
        ears[i] = createVector(points[7+i].x, points[7+i].y);
    }

    nose = createVector(points[0].x, points[0].y);
    
    // wrists
    wrists[0].x += points[15].x;
    wrists[0].y += points[15].y;
    wrists[1].x += points[16].x;
    wrists[1].y += points[16].y;

    // thumbs
    wrists[0].x += points[21].x;
    wrists[0].y += points[21].y;
    wrists[1].x += points[22].x;
    wrists[1].y += points[22].y;

    // pinkies
    wrists[0].x += points[17].x;
    wrists[0].y += points[17].y;
    wrists[1].x += points[18].x;
    wrists[1].y += points[18].y;

    // average
    wrists[0].x /= 3;
    wrists[0].y /= 3;
    wrists[1].x /= 3;
    wrists[1].y /= 3;

    // The coordinates are represented as values from 0-1, 
    // so we need to scale them up and flip them horizontally to be in the correct position
    for (let i = 0; i < 2; i++) {
        wrists[i].x = (1 - wrists[i].x) * video.width;
        wrists[i].y *= video.height;
        mouth[i].x = (1 - mouth[i].x) * video.width;
        mouth[i].y *= video.height;
        ears[i].x = (1 - ears[i].x) * video.width;
        ears[i].y *= video.height;
    }

    nose.x = (1 - nose.x) * video.width;
    nose.y *= video.height;
}