/* game.js - Sentient Pong (No paddles, only ball survival mode)
   - Default: Easy
   - Sudden-death (first to 1)
   - Stats: totalGames, playerWins, aiWins (persist until refresh)
   - Responsive scaling
*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOver");
const winnerText = document.getElementById("winner");

// ----- Game state -----
let difficulty = "easy"; // always easy
let gameRunning = false;
let countdown = 0;

const ballSize = 40;
const ballImage = new Image();
ballImage.src = "./assets/senti.png"; // your PNG path
let ballX = 0, ballY = 0, ballSpeedX = 0, ballSpeedY = 0;

let score = 0;
let totalGames = 0;
let playerWins = 0;
let aiWins = 0;

// If no custom size in HTML
if (!canvas.width || canvas.width < 400) canvas.width = 800;
if (!canvas.height || canvas.height < 300) canvas.height = 450;

// Responsive scaling
function applyCanvasScale() {
  const maxW = window.innerWidth * 0.94;
  const maxH = window.innerHeight * 0.84;
  const scale = Math.min(maxW / canvas.width, maxH / canvas.height, 1);
  canvas.style.width = Math.round(canvas.width * scale) + "px";
  canvas.style.height = Math.round(canvas.height * scale) + "px";
}
window.addEventListener("resize", applyCanvasScale);
applyCanvasScale();

// Reset ball
function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  const baseSpeed = difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
  ballSpeedY = (Math.random() * 2 - 1) * baseSpeed;
}

// Draw ball
function drawBall() {
  if (ballImage && ballImage.complete && ballImage.naturalWidth) {
    ctx.drawImage(ballImage, ballX, ballY, ballSize, ballSize);
  } else {
    ctx.fillStyle = "#ff66a3";
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
  }
}

// Draw scoreboard
function drawScoreboard() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText(`Score: ${score} | Games: ${totalGames} | Wins: ${playerWins} | AI: ${aiWins}`, canvas.width / 2, 30);
}

// End round
function endRound(playerWon) {
  gameRunning = false;
  totalGames++;
  if (playerWon) playerWins++;
  else aiWins++;
  winnerText.innerText = playerWon ? "🎉 You Survived!" : "💀 You Lost!";
  canvas.style.display = "none";
  gameOverScreen.classList.remove("hidden");
}

// Main loop
function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawScoreboard();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce top/bottom
  if (ballY <= 0) { ballY = 0; ballSpeedY = -ballSpeedY; }
  if (ballY + ballSize >= canvas.height) { ballY = canvas.height - ballSize; ballSpeedY = -ballSpeedY; }

  // OUT OF BOUNDS left/right = lose
  if (ballX + ballSize < 0 || ballX > canvas.width) {
    endRound(false);
    return;
  }

  // Increase score slowly over time
  score++;

  if (gameRunning) requestAnimationFrame(draw);
}

// Countdown before start
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
    if (countdown >= -1) {
      setTimeout(step, 700);
    } else {
      resetBall();
      score = 0;
      gameRunning = true;
      requestAnimationFrame(draw);
    }
  }
  step();
}

// Start button
startBtn.addEventListener("click", () => {
  difficulty = "easy"; // forced easy
  score = 0;
  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  applyCanvasScale();
  startCountdownAndRun();
});

// Restart button
restartBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  menu.classList.remove("hidden");
  canvas.style.display = "none";
});

// Init
canvas.style.display = "none";
resetBall();
applyCanvasScale();
