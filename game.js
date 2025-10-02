const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const loader = document.getElementById("loader");
const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverDiv = document.getElementById("gameOver");
const winnerText = document.getElementById("winner");

let paddleWidth = 10, paddleHeight = 80;
let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSize = 15;
let ballSpeedX = 5;
let ballSpeedY = 5;

let leftScore = 0, rightScore = 0;
let gameRunning = false;
let mode = "ai";
let difficulty = "normal";

const ballImage = new Image();
ballImage.src = "assets/ball.png";

// 🟢 Smooth movement helper
function smoothMove(current, target, speed) {
  const diff = target - current;
  return current + diff * speed;
}

function drawPaddle(x, y) {
  ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function drawBall() {
  ctx.drawImage(ballImage, ballX, ballY, ballSize, ballSize);
}

function resetBallPosition() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = Math.random() > 0.5 ? 5 : -5;
  ballSpeedY = Math.random() > 0.5 ? 5 : -5;
}

function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles & ball
  ctx.fillStyle = "white";
  drawPaddle(0, leftPaddleY);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY);
  drawBall();

  // Draw score
  ctx.font = "20px Arial";
  ctx.fillText(leftScore, canvas.width / 4, 20);
  ctx.fillText(rightScore, (3 * canvas.width) / 4, 20);

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce off walls
  if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

  // Paddle collision
  if (
    ballX <= paddleWidth &&
    ballY + ballSize >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight
  ) ballSpeedX = -ballSpeedX;

  if (
    ballX + ballSize >= canvas.width - paddleWidth &&
    ballY + ballSize >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight
  ) ballSpeedX = -ballSpeedX;

  // Score
  if (ballX < 0) {
    rightScore++;
    resetBallPosition();
  }
  if (ballX + ballSize > canvas.width) {
    leftScore++;
    resetBallPosition();
  }

  // AI Control
  if (mode === "ai") {
    let targetY = ballY - paddleHeight / 2 + ballSize / 2;
    rightPaddleY = smoothMove(rightPaddleY, targetY, 0.3); // smoother and faster
  }

  // Win condition
  if (leftScore >= 3 || rightScore >= 3) {
    gameRunning = false;
    gameOverDiv.classList.add("active");
    winnerText.innerText = leftScore >= 3 ? "Player Wins!" : "AI Wins!";
  } else {
    requestAnimationFrame(draw);
  }
}

// Controls
document.addEventListener("keydown", (e) => {
  if (mode === "multiplayer") {
    if (e.key === "w" && leftPaddleY > 0) leftPaddleY -= 20;
    if (e.key === "s" && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += 20;
    if (e.key === "ArrowUp" && rightPaddleY > 0) rightPaddleY -= 20;
    if (e.key === "ArrowDown" && rightPaddleY < canvas.height - paddleHeight) rightPaddleY += 20;
  } else {
    if (e.key === "w" && leftPaddleY > 0) leftPaddleY -= 20;
    if (e.key === "s" && leftPaddleY < canvas.height - paddleHeight) leftPaddleY += 20;
  }
});

// Start game
startBtn.addEventListener("click", () => {
  mode = document.getElementById("mode").value;
  difficulty = document.getElementById("speed").value;

  if (difficulty === "easy") ballSpeedX = 3;
  if (difficulty === "normal") ballSpeedX = 5;
  if (difficulty === "hard") ballSpeedX = 8;

  leftScore = 0;
  rightScore = 0;
  resetBallPosition();
  gameRunning = true;
  menu.classList.remove("active");
  draw();
});

// Restart
restartBtn.addEventListener("click", () => {
  gameOverDiv.classList.remove("active");
  menu.classList.add("active");
});

// Fake Loader
let loadPercent = 0;
const loadInterval = setInterval(() => {
  loadPercent += 10;
  loader.innerText = `Loading... ${loadPercent}%`;
  if (loadPercent >= 100) {
    clearInterval(loadInterval);
    loader.style.display = "none";
    menu.classList.add("active");
  }
}, 300);
