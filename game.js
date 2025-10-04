// 🎮 Sentient Pong Game Script — Fixed Player/AI paddle sizes

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const gameOverScreen = document.getElementById("gameOver");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let gameRunning = false;
let difficulty = "easy";

let ballX, ballY, ballSpeedX, ballSpeedY;
let playerY, aiY;
let paddleWidth = 12;
let playerHeight, aiHeight;
let aiSpeed, ballBaseSpeed;

// ===== Difficulty Settings =====
function setDifficulty(level) {
  difficulty = level;
  if (level === "easy") {
    playerHeight = 130;  // 🟢 Player big
    aiHeight = 70;       // 🔴 AI small
    aiSpeed = 3;
    ballBaseSpeed = 3;
  } else if (level === "normal") {
    playerHeight = 100;
    aiHeight = 100;
    aiSpeed = 5;
    ballBaseSpeed = 4;
  } else if (level === "hard") {
    playerHeight = 70;   // 🔴 Player small
    aiHeight = 130;      // 🟢 AI big
    aiSpeed = 7;
    ballBaseSpeed = 5;
  }
}

// ===== Ball Reset =====
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * ballBaseSpeed;
  ballSpeedY = (Math.random() * 2 - 1) * ballBaseSpeed;
}

// ===== Start Game =====
startBtn.addEventListener("click", () => {
  const select = document.getElementById("difficulty");
  setDifficulty(select.value);

  canvas.width = 800;
  canvas.height = 500;

  playerY = (canvas.height - playerHeight) / 2;
  aiY = (canvas.height - aiHeight) / 2;

  resetBall();

  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  canvas.style.display = "block";
  gameRunning = true;

  requestAnimationFrame(draw);
});

// ===== Restart =====
restartBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  menu.classList.remove("hidden");
  canvas.style.display = "none";
});

// ===== Player Control =====
document.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  playerY = e.clientY - rect.top - playerHeight / 2;
});

// ===== AI Movement =====
function moveAI() {
  const aiCenter = aiY + aiHeight / 2;
  // Smooth follow — add a slight “delay” for realism
  const followSpeed = aiSpeed * 0.8;
  if (aiCenter < ballY - 20) aiY += followSpeed;
  else if (aiCenter > ballY + 20) aiY -= followSpeed;

  aiY = Math.max(0, Math.min(canvas.height - aiHeight, aiY));
}

// ===== Ball Movement =====
function moveBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce top/bottom
  if (ballY < 0 || ballY > canvas.height) ballSpeedY = -ballSpeedY;

  // Player paddle collision (left)
  if (
    ballX - 10 < paddleWidth &&
    ballY > playerY &&
    ballY < playerY + playerHeight
  ) {
    ballSpeedX = Math.abs(ballSpeedX); // always move right
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // AI paddle collision (right)
  if (
    ballX + 10 > canvas.width - paddleWidth &&
    ballY > aiY &&
    ballY < aiY + aiHeight
  ) {
    ballSpeedX = -Math.abs(ballSpeedX); // always move left
    ballSpeedY += (Math.random() - 0.5) * 2;
  }

  // Out of bounds → Game over
  if (ballX < 0) endGame("🤖 AI Wins!");
  else if (ballX > canvas.width) endGame("🏆 You Win!");
}

// ===== Draw Everything =====
function draw() {
  if (!gameRunning) return;

  // Background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Player paddle (Left)
  ctx.fillStyle = "#ff66a3";
  ctx.fillRect(0, playerY, paddleWidth, playerHeight);

  // AI paddle (Right)
  ctx.fillStyle = "#a966ff";
  ctx.fillRect(canvas.width - paddleWidth, aiY, paddleWidth, aiHeight);

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  moveAI();
  moveBall();

  requestAnimationFrame(draw);
}

// ===== Game Over =====
function endGame(msg) {
  gameRunning = false;
  canvas.style.display = "none";
  document.getElementById("gameOverMessage").textContent = msg;
  gameOverScreen.classList.remove("hidden");
}
