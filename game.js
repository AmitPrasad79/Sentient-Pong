const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Paddles
const paddleHeight = 100;
const paddleWidth = 10;
let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let paddleSpeed = 8;

// Ball
let ballSize = 30;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

// Score
let leftScore = 0;
let rightScore = 0;

// Dog image as ball
let dogImage = new Image();
dogImage.src = "assets/dog.png"; // Place your PNG inside assets/

// Game state
let gameRunning = false;
let mode = "ai";

// Difficulty settings
const speeds = {
  easy: { ballX: 4, ballY: 2.5 },
  normal: { ballX: 6, ballY: 3 },
  hard: { ballX: 8, ballY: 4.5 }
};

function drawPaddle(x, y) {
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.drawImage(dogImage, ballX, ballY, ballSize, ballSize);
}

function resetBallPosition() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * Math.abs(ballSpeedY);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  ctx.fillStyle = "white";
  drawPaddle(0, leftPaddleY);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY);

  // Draw ball
  drawBall();

  // Draw scores
  ctx.font = "20px Arial";
  ctx.fillText(leftScore, canvas.width / 4, 20);
  ctx.fillText(rightScore, (3 * canvas.width) / 4, 20);

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall bounce
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Paddle collisions
  if (
    ballX <= paddleWidth &&
    ballY + ballSize >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }
  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY + ballSize >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
  }

  // Scoring
  if (ballX < 0) {
    rightScore++;
    resetBallPosition();
  }
  if (ballX + ballSize > canvas.width) {
    leftScore++;
    resetBallPosition();
  }

  // AI paddle
  if (mode === "ai") {
    if (rightPaddleY + paddleHeight / 2 < ballY) {
      rightPaddleY += paddleSpeed * 0.7;
    } else {
      rightPaddleY -= paddleSpeed * 0.7;
    }
  }

  requestAnimationFrame(draw);
}

// Controls
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
  if (e.key === "ArrowDown" && leftPaddleY + paddleHeight < canvas.height)
    leftPaddleY += paddleSpeed;

  if (mode === "multiplayer") {
    if (e.key === "w" && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
    if (e.key === "s" && rightPaddleY + paddleHeight < canvas.height)
      rightPaddleY += paddleSpeed;
  }
});

// Start button handler
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("overlay").style.display = "none";

  mode = document.getElementById("mode").value;
  let selectedSpeed = document.getElementById("speed").value;

  ballSpeedX =
    speeds[selectedSpeed].ballX * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY =
    speeds[selectedSpeed].ballY * (Math.random() > 0.5 ? 1 : -1);

  if (!gameRunning) {
    gameRunning = true;
    requestAnimationFrame(draw);
  }
});
