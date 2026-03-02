// ===============================
// 🌹 Hand Gesture Rose Controller
// ===============================

// Hidden video
const videoElement = document.createElement("video");
videoElement.style.display = "none";
document.body.appendChild(videoElement);

// MediaPipe Hands
const hands = new Hands({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

let previousX = 0;
let previousY = 0;
let explosionCooldown = false;

hands.onResults((results) => {
  if (!results.multiHandLandmarks?.length) return;

  const landmarks = results.multiHandLandmarks[0];

  const wrist = landmarks[0];
  const x = wrist.x * window.innerWidth;
  const y = wrist.y * window.innerHeight;

  detectSwipe(x, y);
  detectOpenHand(landmarks);

  previousX = x;
  previousY = y;
});

// Start camera
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 640,
  height: 480,
});

camera.start();


// ===============================
// ✋ SUPER RELAXED Open Hand
// ===============================
function detectOpenHand(landmarks) {
  const fingerTips = [8, 12, 16, 20];
  let openFingers = 0;

  fingerTips.forEach((tip) => {
    const tipY = landmarks[tip].y;
    const pipY = landmarks[tip - 2].y;

    // VERY relaxed threshold
    if (tipY < pipY - 0.01) {
      openFingers++;
    }
  });

  // Only need 2 fingers open now
  if (openFingers >= 2 && !explosionCooldown) {
    createRoseExplosionFullScreen();
    explosionCooldown = true;

    setTimeout(() => {
      explosionCooldown = false;
    }, 1000);
  }
}


// ===============================
// 👉 Softer Swipe Detection
// ===============================
function detectSwipe(x, y) {
  const velocityX = x - previousX;
  const velocityY = y - previousY;

  const speed = Math.sqrt(
    velocityX * velocityX +
    velocityY * velocityY
  );

  if (speed > 10) {
    createTrailRose(x, y);
  }
}


// ===============================
// 🌹 FULL SCREEN Explosion
// ===============================
function createRoseExplosionFullScreen() {
  const totalRoses = 40;

  for (let i = 0; i < totalRoses; i++) {
    const rose = document.createElement("div");
    rose.classList.add("rose");

    // Random start position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    rose.style.left = startX + "px";
    rose.style.top = startY + "px";

    // Random size
    const size = 60 + Math.random() * 60;
    rose.style.width = size + "px";
    rose.style.height = size + "px";

    // Random movement
    const angle = Math.random() * 2 * Math.PI;
    const distance = 200 + Math.random() * 200;

    // Apply smooth CSS transition
    rose.style.transition = `transform 2s ease-out, opacity 2s ease-out`;

    document.body.appendChild(rose);

    // Trigger animation on next frame
    requestAnimationFrame(() => {
      rose.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${Math.random() * 720}deg)`;
      rose.style.opacity = 0;
    });

    // Remove after animation
    setTimeout(() => {
      rose.remove();
    }, 2000);
  }
}


// ===============================
// 🌠 Trail Effect
// ===============================
function createTrailRose(x, y) {
  const rose = document.createElement("div");
  rose.classList.add("rose");

  // Position
  rose.style.left = x + "px";
  rose.style.top = y + "px";

  // Size
  const size = 50 + Math.random() * 50;
  rose.style.width = size + "px";
  rose.style.height = size + "px";

  // Smooth fade
  rose.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";

  document.body.appendChild(rose);

  // Random movement for trail
  const angle = Math.random() * 2 * Math.PI;
  const distance = 50 + Math.random() * 50;

  requestAnimationFrame(() => {
    rose.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) rotate(${Math.random() * 360}deg)`;
    rose.style.opacity = 0;
  });

  setTimeout(() => {
    rose.remove();
  }, 1000);
}