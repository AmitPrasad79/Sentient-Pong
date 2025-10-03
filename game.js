/* game.js - Sentient Pong (updated)
   - Default: Easy
   - Sudden-death (first to 1)
   - Stats: totalGames, playerWins, aiWins (persist until refresh)
   - Responsive scaling, touch/mouse/keyboard controls
*/

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverScreen = document.getElementById("gameOver");
const winnerText = document.getElementById("winner");

// ----- Game configuration & state -----
let difficulty = "easy";            // default forced easy
let gameRunning = false;
let countdown = 0;

const paddleWidth = 15;
const playerPaddleHeight = 80;
let aiPaddleHeight = 40;            // shorter AI paddle on easy
let leftPaddleY = 0;
let rightPaddleY = 0;

const ballSize = 40;
const ballImage = new Image();
ballImage.src = "./assets/senti.png"; // your PNG path
let ballX = 0, ballY = 0, ballSpeedX = 0, ballSpeedY = 0;

let leftScore = 0, rightScore = 0;

// Stats (persist until refresh)
let totalGames = 0;
let playerWins = 0;
let aiWins = 0;

// Controls
let keys = {};
window.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// If the canvas has no custom size in HTML, set a sensible internal resolution
if (!canvas.width || canvas.width < 400) canvas.width = 800;
if (!canvas.height || canvas.height < 300) canvas.height = 450;

// Responsive draw-scaling: render at canvas.width/height internally, scale visually
function applyCanvasScale() {
  const maxW = window.innerWidth * 0.94;
  const maxH = window.innerHeight * 0.84;
  const scale = Math.min(maxW / canvas.width, maxH / canvas.height, 1);
  canvas.style.width = Math.round(canvas.width * scale) + "px";
  canvas.style.height = Math.round(canvas.height * scale) + "px";
}
window.addEventListener("resize", applyCanvasScale);
applyCanvasScale();

// Touch / mouse controls: move left paddle
function handlePointerMove(clientY) {
  const rect = canvas.getBoundingClientRect();
  const y = clientY - rect.top;
  leftPaddleY = y - playerPaddleHeight / 2;
  leftPaddleY = Math.max(0, Math.min(leftPaddleY, canvas.height - playerPaddleHeight));
}
canvas.addEventListener("mousemove", (e) => { if (gameRunning) handlePointerMove(e.clientY); });
canvas.addEventListener("touchmove", (e) => {
  if (!gameRunning) return;
  e.preventDefault();
  handlePointerMove(e.touches[0].clientY);
}, { passive:false });

// Reset ball and paddles
function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  // easy speed is slow
  const baseSpeed = difficulty === "easy" ? 2 : difficulty === "normal" ? 3 : 4;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * baseSpeed;
  ballSpeedY = (Math.random() * 2 - 1) * baseSpeed;
}
function resetPaddles() {
  leftPaddleY = (canvas.height - playerPaddleHeight) / 2;
  rightPaddleY = (canvas.height - aiPaddleHeight) / 2;
}

// Drawing helpers
function drawPaddle(x, y, h) {
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, paddleWidth, h);
}
function drawBall() {
  if (ballImage && ballImage.complete && ballImage.naturalWidth) {
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
  ctx.fillText(`Games: ${totalGames}  |  Wins: ${playerWins}  |  AI: ${aiWins}`, canvas.width/2, 30);
}

// End round (sudden death)
function endRound(playerWon) {
  gameRunning = false;
  totalGames++;
  if (playerWon) playerWins++;
  else aiWins++;

  // update winner text and show gameOver panel
  winnerText.innerText = playerWon ? "🎉 You Win!" : "🤖 AI Wins!";
  canvas.style.display = "none";
  gameOverScreen.classList.remove("hidden");
}

// Main draw loop
function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw field
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw paddles & ball
  drawPaddle(0, leftPaddleY, playerPaddleHeight);
  drawPaddle(canvas.width - paddleWidth, rightPaddleY, aiPaddleHeight);
  drawBall();
  drawScoreboard();

  // move ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // bounce top/bottom
  if (ballY <= 0) { ballY = 0; ballSpeedY = -ballSpeedY; }
  if (ballY + ballSize >= canvas.height) { ballY = canvas.height - ballSize; ballSpeedY = -ballSpeedY; }

  // player paddle collision
  if (ballX <= paddleWidth && ballY + ballSize >= leftPaddleY && ballY <= leftPaddleY + playerPaddleHeight) {
    ballX = paddleWidth; // nudge out
    ballSpeedX = Math.abs(ballSpeedX) * 1.02; // reflect and slightly speed up horizontally
    // add a little random vertical kick
    ballSpeedY += (Math.random() - 0.5) * 1.2;
  }

  // AI paddle collision
  if (ballX + ballSize >= canvas.width - paddleWidth &&
      ballY + ballSize >= rightPaddleY && ballY <= rightPaddleY + aiPaddleHeight) {
    ballX = canvas.width - paddleWidth - ballSize;
    ballSpeedX = -Math.abs(ballSpeedX) * 1.02;
    ballSpeedY += (Math.random() - 0.5) * 1.0;
  }

  // OUT OF BOUNDS -> sudden death immediate round end
  if (ballX + ballSize < 0) {
    // AI scored
    rightScore++;
    endRound(false);
    return;
  }
  if (ballX > canvas.width) {
    // Player scored
    leftScore++;
    endRound(true);
    return;
  }

  // Player keyboard fallback (W/S and ArrowUp/ArrowDown)
  const step = 6;
  if ((keys["w"] || keys["arrowup"]) && leftPaddleY > 0) leftPaddleY -= step;
  if ((keys["s"] || keys["arrowdown"]) && leftPaddleY + playerPaddleHeight < canvas.height) leftPaddleY += step;
  leftPaddleY = Math.max(0, Math.min(leftPaddleY, canvas.height - playerPaddleHeight));

  // AI movement: dumber on easy (big error + slow), better on others
  let aiSpeed = difficulty === "easy" ? 3 : difficulty === "normal" ? 5 : 7;
  let errorMargin = difficulty === "easy" ? 100 : difficulty === "normal" ? 40 : 12;
  // target center offset by random error so AI can miss sometimes
  let target = ballY + ballSize/2 - aiPaddleHeight/2 + (Math.random() * errorMargin - errorMargin/2);

  // move AI toward target (step-based)
  const aiCenter = rightPaddleY + aiPaddleHeight/2;
  if (aiCenter < target) rightPaddleY += aiSpeed;
  else if (aiCenter > target) rightPaddleY -= aiSpeed;

  // clamp AI paddle
  rightPaddleY = Math.max(0, Math.min(rightPaddleY, canvas.height - aiPaddleHeight));

  // next frame
  if (gameRunning) requestAnimationFrame(draw);
}

// Countdown animation (3,2,1,Go)
function startCountdownAndRun() {
  countdown = 3;
  canvas.style.display = "block";
  // visually reset canvas for the countdown
  function step() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "#111";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font = "72px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(countdown > 0 ? countdown : "Go!", canvas.width/2, canvas.height/2);
    countdown--;
    if (countdown >= -1) {
      setTimeout(step, 700);
    } else {
      // start game
      resetBall();
      gameRunning = true;
      requestAnimationFrame(draw);
    }
  }
  step();
}

// Start button handler
startBtn.addEventListener("click", () => {
  // force easy default
  difficulty = "easy";
  aiPaddleHeight = 40; // short AI paddle on easy
  leftScore = 0;
  rightScore = 0;
  resetPaddles();
  menu.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  applyCanvasScale();
  startCountdownAndRun();
});

// Restart button returns to menu (keeps stats)
restartBtn.addEventListener("click", () => {
  gameOverScreen.classList.add("hidden");
  menu.classList.remove("hidden");
  canvas.style.display = "none";
});

// Initialize: hide canvas & ensure paddles/ball positioned
canvas.style.display = "none";
resetPaddles();
resetBall();
applyCanvasScale();
