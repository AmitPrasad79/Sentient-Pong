// 🎮 Sentient Pong Game Script

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOver");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let gameRunning = false;
let difficulty = "easy";

// ===== Game Variables =====
let ballX, ballY, ballSpeedX, ballSpeedY;
let leftPaddleY, rightPaddleY;
let paddleWidth = 12;
let playerPaddleHeight, aiPaddleHeight;
let aiSpeed, ballBaseSpeed;
let leftScore = 0;
let rightScore = 0;

// ===== Utility =====
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * ballBaseSpeed;
  ballSpeedY = (Math.random() * 2 - 1) * ballBaseSpeed;
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "20px Poppins";
  ctx.fillText(text, x, y);
}

// ===== Difficulty Settings =====
function setDifficulty(level) {
  difficulty = level;
  if (level === "easy") {
    playerPaddleHeight = 130;
    aiPaddleHeight = 70;
    aiSpeed = 3;
    ballBaseSpeed = 3;
  } else if (level === "normal") {
    playerPaddleHeight = 90;
    aiPaddleHeight = 90;
    aiSpeed = 5;
    ballBaseSpeed = 4;
  } else if (level === "hard") {
    playerPaddleHeight = 70;
    aiPaddleHeight = 110;
    aiSpeed = 7;
    ballBaseSpeed = 5;
  }
}

// ===== Start Game =====
startBtn.addEventListener("click", () => {
  const select = document.getElementById("difficulty");
  setDifficulty(select.value);

  canvas.width = 800;
  canvas.height = 500;

  leftPaddleY = (canvas.height - playerPaddleHeight) / 2;
  rightPaddleY = (canvas.height - aiPaddleHeight) / 2;

  resetBall();

  leftScore = 0;
  rightScore = 0;
  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  canvas.style.display = "block";

  gameRunning = true;
  requestAnimationFrame(draw);
});

// ===== Restart Game =====
restartBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  menu.classList.remove("hidden");
  canvas.style.display = "none";
});

// ===== Input Controls =====
document.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  let root = e.clientY - rect.top;
  leftPaddleY = root - playerPaddleHeight / 2;
});

// ===== AI Logic =====
function moveAI() {
  const aiCenter = rightPaddleY + aiPaddleHeight / 2;
  if (aiCenter < ballY - 35) rightPaddleY += aiSpeed;
  else if (aiCenter > ballY + 35) rightPaddleY -= aiSpeed;

  // Keep AI within bounds
  rightPaddleY = Math.max(0, Math.min(canvas.height - aiPaddleHeight, rightPaddleY));
}

// ===== Ball Movement =====
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce top/bottom
  if (ballY < 0 || ballY > canvas.height) ballSpeedY = -ballSpeedY;

  // Left paddle collision
  if (
    ballX - 10 < paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + playerPaddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // Right paddle collision
  if (
    ballX + 10 > canvas.width - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + aiPaddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // Missed ball (game over)
  if (ballX < 0) {
    endGame("AI Wins!");
  } else if (ballX > canvas.width) {
    endGame("You Win!");
  }
}

// ===== Draw Everything =====
function draw() {
  if (!gameRunning) return;

  drawRect(0, 0, canvas.width, canvas.height, "#000");
  drawRect(0, leftPaddleY, paddleWidth, playerPaddleHeight, "#ff66a3");
  drawRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, aiPaddleHeight, "#ff66a3");
  drawCircle(ballX, ballY, 10, "#fff");

  moveAI();
  moveBall();

  requestAnimationFrame(draw);
}

// ===== Game Over =====
function endGame(message) {
  gameRunning = false;
  canvas.style.display = "none";
  gameOverScreen.classList.remove("hidden");
  document.getElementById("gameOverMessage").textContent = message;
}
