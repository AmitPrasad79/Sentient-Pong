const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOver");
const winnerText = document.getElementById("winner");

let difficulty = "easy";
let gameRunning = false;
let countdown = 0;

const paddleWidth = 15;
const playerPaddleHeight = 80;
let aiPaddleHeight = 60;
let leftPaddleY = 0;
let rightPaddleY = 0;

const ballSize = 40;
const ballImage = new Image();
ballImage.src = "./assets/sentient.png";

let ballX = 0, ballY = 0, ballSpeedX = 0, ballSpeedY = 0;
let leftScore = 0, rightScore = 0;
let totalGames = 0, playerWins = 0, aiWins = 0;

let keys = {};
window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// Adjust canvas size responsively
function applyCanvasScale() {
  const maxW = window.innerWidth * 0.94;
  const maxH = window.innerHeight * 0.84;
  const scale = Math.min(maxW / canvas.width, maxH / canvas.height, 1);
  canvas.style.width = Math.round(canvas.width * scale) + "px";
  canvas.style.height = Math.round(canvas.height * scale) + "px";
}
window.addEventListener("resize", applyCanvasScale);
applyCanvasScale();

function handlePointerMove(clientY) {
  const rect = canvas.getBoundingClientRect();
  const y = clientY - rect.top;
  leftPaddleY = Math.max(0, Math.min(y - playerPaddleHeight / 2, canvas.height - playerPaddleHeight));
}
canvas.addEventListener("mousemove", (e) => gameRunning && handlePointerMove(e.clientY));
canvas.addEventListener("touchmove", (e) => {
  if (!gameRunning) return;
  e.preventDefault();
  handlePointerMove(e.touches[0].clientY);
}, { passive: false });

function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;

  const baseSpeed = difficulty === "easy" ? 2.5 : difficulty === "normal" ? 3.8 : 5.2;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
  ballSpeedY = (Math.random() * 2 - 1) * baseSpeed;
}

function resetPaddles() {
  leftPaddleY = (canvas.height - playerPaddleHeight) / 2;
  rightPaddleY = (canvas.height - aiPaddleHeight) / 2;
}

function drawPaddle(x, y, h) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, paddleWidth, h);
}

function drawBall() {
  if (ballImage.complete && ballImage.naturalWidth) {
    ctx.drawImage(ballImage, ballX, ballY, ballSize, ballSize);
  } else {
    ctx.fillStyle = "#ff66a3";
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
  }
}

function drawScoreboard() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(`Games: ${totalGames}  |  You: ${playerWins}  |  AI: ${aiWins}`, canvas.width / 2, 30);
}

function endRound(playerWon) {
  gameRunning = false;
  totalGames++;
  if (playerWon) playerWins++;
  else aiWins++;

  winnerText.innerText = playerWon ? "🎉 You Win!" : "🤖 You Lose!";
  canvas.style.display = "none";
  gameOverScreen.classList.remove("hidden");
}

function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawPaddle(0, leftPaddleY, playerPaddleHeight);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY, aiPaddleHeight);
  drawBall();
  drawScoreboard();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce
  if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

  // Player paddle
  if (ballX <= paddleWidth && ballY + ballSize >= leftPaddleY && ballY <= leftPaddleY + playerPaddleHeight) {
    ballSpeedX = Math.abs(ballSpeedX);
    ballSpeedY += (Math.random() - 0.5) * 1.2;
  }

  // AI paddle
  if (ballX + ballSize >= canvas.width - paddleWidth &&
      ballY + ballSize >= rightPaddleY && ballY <= rightPaddleY + aiPaddleHeight) {
    ballSpeedX = -Math.abs(ballSpeedX);
    ballSpeedY += (Math.random() - 0.5) * 1.0;
  }

  // Score
  if (ballX + ballSize < 0) return endRound(false);
  if (ballX > canvas.width) return endRound(true);

  // Player movement
  const step = 6;
  if (keys["w"] || keys["arrowup"]) leftPaddleY -= step;
  if (keys["s"] || keys["arrowdown"]) leftPaddleY += step;
  leftPaddleY = Math.max(0, Math.min(leftPaddleY, canvas.height - playerPaddleHeight));

  // AI follows ball
  const aiSpeed = difficulty === "easy" ? 3 : difficulty === "normal" ? 5 : 7;
  const aiCenter = rightPaddleY + aiPaddleHeight / 2;
  if (aiCenter < ballY + ballSize / 2 - 10) rightPaddleY += aiSpeed;
  else if (aiCenter > ballY + ballSize / 2 + 10) rightPaddleY -= aiSpeed;
  rightPaddleY = Math.max(0, Math.min(rightPaddleY, canvas.height - aiPaddleHeight));

  requestAnimationFrame(draw);
}

// Countdown animation before start
function startCountdownAndRun() {
  countdown = 3;
  canvas.style.display = "block";
  function step() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "72px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(countdown > 0 ? countdown : "Go!", canvas.width / 2, canvas.height / 2);
    countdown--;
    if (countdown >= -1) setTimeout(step, 700);
    else {
      resetBall();
      gameRunning = true;
      requestAnimationFrame(draw);
    }
  }
  step();
}

// ✅ FIXED start button
startBtn.addEventListener("click", () => {
  const select = document.querySelector(".selected");
  difficulty = select.dataset.value || "easy";

  aiPaddleHeight = difficulty === "easy" ? 60 :
                   difficulty === "normal" ? 80 :
                   100;

  leftScore = 0;
  rightScore = 0;
  resetPaddles();
  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  applyCanvasScale();
  startCountdownAndRun();
});

restartBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  menu.classList.remove("hidden");
  canvas.style.display = "none";
});

canvas.style.display = "none";
resetPaddles();
resetBall();
applyCanvasScale();
