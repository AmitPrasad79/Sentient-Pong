// fall.js - smooth snowfall style background using senti.png

const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

// make sure transparency is respected
bgCtx.imageSmoothingEnabled = true;

// resize canvas to full screen
function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// load image
const ballImg = new Image();
ballImg.src = "./assets/sentii.jpg"; // make sure this path is correct

// store falling objects
let balls = [];
const MAX_BALLS = 6; // keep it low for gentle effect

function createBall() {
  const size = 25 + Math.random() * 20; // random size
  return {
    x: Math.random() * bgCanvas.width,
    y: -size,
    size: size,
    speed: 0.7 + Math.random() * 1.2,
    drift: (Math.random() - 0.5) * 0.5 // little side movement
  };
}

// main loop
function animate() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height); // keep background transparent

  // add new balls until max
  if (balls.length < MAX_BALLS) {
    balls.push(createBall());
  }

  // update and draw
  balls.forEach((ball, i) => {
    ball.y += ball.speed;
    ball.x += ball.drift;

    if (ballImg.complete) {
      bgCtx.drawImage(ballImg, ball.x, ball.y, ball.size, ball.size);
    }

    // remove if out of screen
    if (ball.y > bgCanvas.height + ball.size) {
      balls.splice(i, 1);
    }
  });

  requestAnimationFrame(animate);
}

ballImg.onload = animate;
