let video;          // The p5 video feed used to display what the camera sees
let wrists = [];    // Stores the values of the left and right wrists of the player
let prev = [];      // Stores the previous values of the wrists to calculate motion

function setupPoseDetectionPart() {
    // Initialize the video object
    video = createCapture(VIDEO);
    video.size(640, 480);
    video.hide();

    // Initialize the x and y points of the wrists
    for (var i = 0; i < 2; i++) {
        wrists[i] = { x: 0, y: 0 };
        prev[i] = { x: 0, y: 0 };
    }

    // Create the pose detector with the given settings
    let pose = new Pose({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
    });
    pose.setOptions({
        modelComplexity: 0,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    pose.onResults(predict);
    let videoElement = document.getElementsByTagName("video")[0];
    let camera = new Camera(videoElement, {
        onFrame: async () => {
            await pose.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });
    //camera.start();

    // Don't display the HTML video element in the scene
    videoElement.style.display = "none";
}






// This function is called anytime a pose is detected
function predict(results) {
    // The keypoints in the current pose
    let points = results.poseLandmarks;

    // If there are no points detected, leave the function
    if (points == null) return;

    // Update the previous wrist values to be the current wrist values
    prev[0] = { x: wrists[0].x, y: wrists[0].y };
    prev[1] = { x: wrists[1].x, y: wrists[1].y };

    // Initialize the x and y points of the wrists
    for (var i = 0; i < 2; i++) wrists[i] = { x: 0, y: 0 };

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
    for (let i = 0; i < wrists.length; i++) {
        wrists[i].x = (1 - wrists[i].x) * video.width;
        wrists[i].y *= video.height;
    }
}