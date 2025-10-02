const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const countdown = document.getElementById("countdown");
const countText = document.getElementById("countText");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOver = document.getElementById("gameOver");
const winnerText = document.getElementById("winnerText");
const restartBtn = document.getElementById("restartBtn");

let gameRunning = false;
let ballX, ballY, ballSpeedX, ballSpeedY;
let paddleY, aiY;
let playerScore = 0;
let highScore = 0;
let difficulty = "normal";

// Reset ball position
function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 3;
  ballSpeedY = 2;
}

// Draw paddle
function drawPaddle(x, y) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, 10, 80);
}

// Draw ball
function drawBall() {
  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fill();
}

// End game
function endGame(msg) {
  gameRunning = false;
  canvas.style.display = "none";
  gameOver.classList.remove("hidden");
  winnerText.textContent = msg + ` | Score: ${playerScore} | High Score: ${highScore}`;
  if (playerScore > highScore) {
    highScore = playerScore;
  }
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles & ball
  drawPaddle(20, paddleY);
  drawPaddle(canvas.width - 30, aiY);
  drawBall();

  // Ball movement
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce top/bottom
  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

  // Left wall -> AI wins
  if (ballX < 0) {
    endGame("AI Wins!");
    return;
  }

  // Right wall -> You win
  if (ballX > canvas.width) {
    endGame("You Win!");
    return;
  }

  // Collision with player paddle
  if (ballX - 10 <= 30 && ballY > paddleY && ballY < paddleY + 80) {
    ballSpeedX *= -1;
    playerScore++;
  }

  // Collision with AI paddle
  if (ballX + 10 >= canvas.width - 30 && ballY > aiY && ballY < aiY + 80) {
    ballSpeedX *= -1;
  }

  // AI follows ball (difficulty controlled)
  let aiSpeed = difficulty === "easy" ? 2 : difficulty === "hard" ? 5 : 3;
  if (ballY > aiY + 40) aiY += aiSpeed;
  else if (ballY < aiY + 40) aiY -= aiSpeed;

  requestAnimationFrame(gameLoop);
}

// Countdown before game starts
function runCountdown(cb) {
  let c = 3;
  countdown.classList.remove("hidden");
  countText.textContent = c;
  let t = setInterval(() => {
    c--;
    if (c > 0) countText.textContent = c;
    else if (c === 0) countText.textContent = "Go!";
    else {
      clearInterval(t);
      countdown.classList.add("hidden");
      cb();
    }
  }, 700);
}

// Start button
startBtn.onclick = () => {
  menu.classList.add("hidden");
  difficulty = document.getElementById("difficulty").value;
  resetBall();
  paddleY = canvas.height / 2 - 40;
  aiY = canvas.height / 2 - 40;
  playerScore = 0;
  runCountdown(() => {
    gameRunning = true;
    canvas.style.display = "block";
    gameLoop();
  });
};

// Move player paddle
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") paddleY -= 20;
  if (e.key === "ArrowDown" || e.key === "s") paddleY += 20;
  // Keep paddle in bounds
  if (paddleY < 0) paddleY = 0;
  if (paddleY > canvas.height - 80) paddleY = canvas.height - 80;
});

// Restart button
restartBtn.onclick = () => {
  gameOver.classList.add("hidden");
  menu.classList.remove("hidden");
};
