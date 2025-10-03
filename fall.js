const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

bgCtx.imageSmoothingEnabled = true;

function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const ballImg = new Image();
ballImg.src = "./assets/sentient.png"; 

let balls = [];
const MAX_BALLS = 6; 

function createBall() {
  const size = 25 + Math.random() * 20; 
  return {
    x: Math.random() * bgCanvas.width,
    y: -size,
    size: size,
    speed: 0.7 + Math.random() * 1.2,
    drift: (Math.random() - 0.5) * 0.5 
  };
}

function animate() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height); 

  if (balls.length < MAX_BALLS) {
    balls.push(createBall());
  }

  balls.forEach((ball, i) => {
    ball.y += ball.speed;
    ball.x += ball.drift;

    if (ballImg.complete) {
      bgCtx.drawImage(ballImg, ball.x, ball.y, ball.size, ball.size);
    }

    if (ball.y > bgCanvas.height + ball.size) {
      balls.splice(i, 1);
    }
  });

  requestAnimationFrame(animate);
}

ballImg.onload = animate;
