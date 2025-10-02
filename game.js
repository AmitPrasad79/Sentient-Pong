console.log("Game script loaded ✅");

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

function resetBall() {
  console.log("Resetting ball...");
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 3;
  ballSpeedY = 2;
}

function drawPaddle(x, y) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, 10, 80);
}

function drawBall() {
  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fill();
}

function endGame(msg) {
  console.log("Game ended:", msg);
  gameRunning = false;
  canvas.style.display = "none";
  gameOver.classList.remove("hidden");
  winnerText.textContent = msg + ` | Score: ${playerScore} | High Score: ${highScore}`;
  if (playerScore > highScore) highScore = playerScore;
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle(20, paddleY);
  drawPaddle(canvas.width - 30, aiY);
  drawBall();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

  if (ballX < 0) return endGame("AI Wins!");
  if (ballX > canvas.width) return endGame("You Win!");

  if (ballX - 10 <= 30 && ballY > paddleY && ballY < paddleY + 80) {
    ballSpeedX *= -1;
    playerScore++;
  }

  if (ballX + 10 >= canvas.width - 30 && ballY > aiY && ballY < aiY + 80) {
    ballSpeedX *= -1;
  }

  let aiSpeed = difficulty === "easy" ? 2 : difficulty === "hard" ? 5 : 3;
  if (ballY > aiY + 40) aiY += aiSpeed;
  else if (ballY < aiY + 40) aiY -= aiSpeed;

  requestAnimationFrame(gameLoop);
}

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

startBtn.onclick = () => {
  console.log("Start clicked");
  menu.classList.add("hidden");
  difficulty = document.getElementById("difficulty").value;
  resetBall();
  paddleY = canvas.height / 2 - 40;
  aiY = canvas.height / 2 - 40;
  playerScore = 0;
  runCountdown(() => {
    console.log("Countdown done, starting game...");
    gameRunning = true;
    canvas.style.display = "block";
    gameLoop();
  });
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" || e.key === "w") paddleY -= 20;
  if (e.key === "ArrowDown" || e.key === "s") paddleY += 20;
  if (paddleY < 0) paddleY = 0;
  if (paddleY > canvas.height - 80) paddleY = canvas.height - 80;
});

restartBtn.onclick = () => {
  console.log("Restart clicked");
  gameOver.classList.add("hidden");
  menu.classList.remove("hidden");
};
