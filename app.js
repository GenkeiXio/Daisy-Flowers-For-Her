$(document).ready(function() {
    // 1. Existing Config Logic
    $('#titleWeb').text(CONFIG.titleWeb)
    $('body').css('background-image', 'url(./images/' + CONFIG.background + ')')

    for (let i = 1; i <= 6; i++)
        $('#min' + i).css('background-image', 'url(./images/' + CONFIG['min' + i] + ')')

    for (let i = 1; i <= 6; i++)
        $('#max' + i).css('background-image', 'url(./images/' + CONFIG['max' + i] + ')')

    // 2. Initialize Camera and Hand Tracking
    const videoElement = document.getElementById('webcam');
    const boxElement = document.querySelector('.box');

    function onResults(results) {
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const hand = results.multiHandLandmarks[0];
            
            // We measure the distance between thumb tip (ID 4) and pinky tip (ID 20)
            const thumbTip = hand[4];
            const pinkyTip = hand[20];

            // Euclidean distance formula
            const distance = Math.sqrt(
                Math.pow(thumbTip.x - pinkyTip.x, 2) + 
                Math.pow(thumbTip.y - pinkyTip.y, 2)
            );

            // Threshold: 0.15 is roughly half-open. 
            // Increase to 0.2 if it expands too easily.
            if (distance > 0.15) {
                boxElement.classList.add('expanded');
            } else {
                boxElement.classList.remove('expanded');
            }
        }
    }

    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        },
        width: 640,
        height: 480
    });

    camera.start();
});