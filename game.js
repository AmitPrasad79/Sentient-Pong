const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const gameOverScreen = document.getElementById("gameOver");
const winnerText = document.getElementById("winner");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty");

let playerY, aiY, ballX, ballY, ballSpeedX, ballSpeedY;
let paddleWidth = 10;
let playerHeight;
let aiHeight;
let aiSpeed;
let ballBaseSpeed;
let ballRadius = 8;

let upPressed = false;
let downPressed = false;
let scorePlayer = 0;
let scoreAI = 0;
let gamesPlayed = 0;
let running = false;
let difficulty = "easy";

// ✅ Difficulty setup
function setDifficulty(level) {
  difficulty = level;
  if (level === "easy") {
    playerHeight = 130;  // YOU larger
    aiHeight = 70;       // AI smaller
    aiSpeed = 3;
    ballBaseSpeed = 3;
  } else if (level === "normal") {
    playerHeight = 100;
    aiHeight = 100;
    aiSpeed = 5;
    ballBaseSpeed = 4;
  } else if (level === "hard") {
    playerHeight = 70;   // YOU smaller
    aiHeight = 130;      // AI larger
    aiSpeed = 7;
    ballBaseSpeed = 5;
  }
}

// ✅ Initialize Game
function initGame() {
  setDifficulty(difficulty); // Ensure correct sizes before start

  playerY = canvas.height / 2 - playerHeight / 2;
  aiY = canvas.height / 2 - aiHeight / 2;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = Math.random() < 0.5 ? ballBaseSpeed : -ballBaseSpeed;
  ballSpeedY = (Math.random() - 0.5) * 4;

  running = true;
  gameOverScreen.classList.add("hidden");
  menu.classList.add("hidden");
  canvas.style.display = "block";

  draw();
}

// ✅ Event Listeners
startBtn.addEventListener("click", () => {
  const selectedDifficulty = difficultySelect.value;
  setDifficulty(selectedDifficulty);
  initGame();
});

restartBtn.addEventListener("click", () => {
  initGame();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") upPressed = true;
  if (e.key === "ArrowDown") downPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowUp") upPressed = false;
  if (e.key === "ArrowDown") downPressed = false;
});

// ✅ Game Loop
function draw() {
  if (!running) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Score Display
  ctx.fillStyle = "#fff";
  ctx.font = "16px Poppins";
  ctx.fillText(`Games: ${gamesPlayed} | Wins: ${scorePlayer} | AI: ${scoreAI}`, 400 - 100, 30);

  // Player paddle (LEFT)
  ctx.fillStyle = "#ff66a3";
  ctx.fillRect(10, playerY, paddleWidth, playerHeight);

  // AI paddle (RIGHT)
  ctx.fillStyle = "#a966ff";
  ctx.fillRect(canvas.width - paddleWidth - 10, aiY, paddleWidth, aiHeight);

  // Ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ff66a3";
  ctx.fill();

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Wall bounce
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Player control
  if (upPressed && playerY > 0) playerY -= 7;
  if (downPressed && playerY + playerHeight < canvas.height) playerY += 7;

  // AI tracking (smooth)
  const aiCenter = aiY + aiHeight / 2;
  if (aiCenter < ballY - 20) aiY += aiSpeed;
  else if (aiCenter > ballY + 20) aiY -= aiSpeed;

  aiY = Math.max(0, Math.min(canvas.height - aiHeight, aiY));

  // Player collision
  if (
    ballX - ballRadius < 10 + paddleWidth &&
    ballY > playerY &&
    ballY < playerY + playerHeight
  ) {
    ballSpeedX = Math.abs(ballSpeedX);
    let deltaY = ballY - (playerY + playerHeight / 2);
    ballSpeedY = deltaY * 0.25;
  }

  // AI collision
  if (
    ballX + ballRadius > canvas.width - paddleWidth - 10 &&
    ballY > aiY &&
    ballY < aiY + aiHeight
  ) {
    ballSpeedX = -Math.abs(ballSpeedX);
    let deltaY = ballY - (aiY + aiHeight / 2);
    ballSpeedY = deltaY * 0.25;
  }

  // Scoring
  if (ballX - ballRadius < 0) {
    scoreAI++;
    gamesPlayed++;
    endGame("AI Wins!");
  } else if (ballX + ballRadius > canvas.width) {
    scorePlayer++;
    gamesPlayed++;
    endGame("You Win!");
  }

  requestAnimationFrame(draw);
}

// ✅ End Game
function endGame(result) {
  running = false;
  winnerText.textContent = result;
  gameOverScreen.classList.remove("hidden");
  canvas.style.display = "none";
}
