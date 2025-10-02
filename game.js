// Canvas setup
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let paddleHeight = 100, paddleWidth = 10;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSize = 25;
let ballSpeedX = 3, ballSpeedY = 3;

let leftScore = 0, rightScore = 0;
let mode = "ai", difficulty = "normal";
let gameRunning = false;

// Load custom ball
const ballImage = new Image();
ballImage.src = "./assets/dog.png";

// Smooth paddle movement
function smoothMove(current, target, speed) {
  return current + (target - current) * speed;
}

// Reset ball to center
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * (difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4);
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * (difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4);
}

// Draw functions
function drawPaddle(x, y) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.drawImage(ballImage, ballX, ballY, ballSize, ballSize);
}

// Main game loop
function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles
  drawPaddle(0, leftPaddleY);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY);

  // Draw ball
  drawBall();

  // Scores
  ctx.font = "20px Arial";
  ctx.fillText(leftScore, canvas.width / 4, 20);
  ctx.fillText(rightScore, (3 * canvas.width) / 4, 20);

  // Move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce
  if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

  // Paddle collisions
  if (ballX <= paddleWidth &&
      ballY + ballSize >= leftPaddleY &&
      ballY <= leftPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }

  if (ballX + ballSize >= canvas.width - paddleWidth &&
      ballY + ballSize >= rightPaddleY &&
      ballY <= rightPaddleY + paddleHeight) {
    ballSpeedX = -ballSpeedX;
  }

  // Scoring
  if (ballX < 0) { rightScore++; resetBall(); }
  if (ballX + ballSize > canvas.width) { leftScore++; resetBall(); }

  // AI movement
  if (mode === "ai") {
    let targetY = ballY - paddleHeight / 2 + ballSize / 2;
    let aiSpeed;

    if (difficulty === "easy") {
      aiSpeed = 0.08;
v
