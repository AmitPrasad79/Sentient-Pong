// Sentient Pong - single-player vs AI
// Put your dog PNG at ./assets/dog.png

window.addEventListener("DOMContentLoaded", () => {
  // Elements
  const menu = document.getElementById("menu");
  const startBtn = document.getElementById("startBtn");
  const difficultySelect = document.getElementById("difficulty");
  const highScoreDisplay = document.getElementById("highScoreDisplay");
  const countdown = document.getElementById("countdown");
  const countText = document.getElementById("countText");
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const gameOver = document.getElementById("gameOver");
  const winnerText = document.getElementById("winnerText");
  const restartBtn = document.getElementById("restartBtn");

  // Canvas size (match CSS width/height)
  canvas.width = 900;
  canvas.height = 600;

  // Game state
  let difficulty = "normal";
  let gameRunning = false;

  // Paddles
  const paddleWidth = 16;
  const paddleHeight = 90;
  let leftPaddleY = (canvas.height - paddleHeight) / 2;
  let rightPaddleY = (canvas.height - paddleHeight) / 2;

  // Ball
  const ballSize = 44;
  const ballImage = new Image();
  ballImage.src = "./assets/dog.png";
  let ballX = canvas.width / 2 - ballSize / 2;
  let ballY = canvas.height / 2 - ballSize / 2;
  let ballSpeedX = 0;
  let ballSpeedY = 0;

  // Scores
  let playerScore = 0;
  let aiScore = 0;
  let highScore = parseInt(localStorage.getItem("sentient_high") || "0", 10);
  highScoreDisplay.innerText = highScore;

  // Controls
  let keys = {};
  window.addEventListener("keydown", (e) => { keys[e.key.toLowerCase()] = true; });
  window.addEventListener("keyup", (e) => { keys[e.key.toLowerCase()] = false; });

  // Helpers
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function resetPaddles() {
    leftPaddleY = (canvas.height - paddleHeight) / 2;
    rightPaddleY = (canvas.height - paddleHeight) / 2;
  }

  function resetBall() {
    ballX = canvas.width / 2 - ballSize / 2;
    ballY = canvas.height / 2 - ballSize / 2;
    const base = difficulty === "easy" ? 2.4 : difficulty === "normal" ? 3.2 : 4.0;
    // random direction
    ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * base;
    ballSpeedY = (Math.random() * 2 - 1) * base * 0.8;
  }

  // Draw helpers
  function drawPaddle(x, y) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
  }
  function drawBall() {
    if (ballImage.complete && ballImage.naturalWidth) {
      ctx.drawImage(ballImage, ballX, ballY, ballSize, ballSize);
    } else {
      // fallback circle while image not loaded
      ctx.beginPath();
      ctx.arc(ballX + ballSize/2, ballY + ballSize/2, ballSize/2, 0, Math.PI*2);
      ctx.fill();
    }
  }

  // Countdown before starting (3,2,1,Go!)
  function runCountdown(cb) {
    countdown.classList.remove("hidden");
    let count = 3;
    countText.innerText = count;
    const t = setInterval(() => {
      count--;
      if (count > 0) {
        countText.innerText = count;
      } else if (count === 0) {
        countText.innerText = "Go!";
      } else {
        clearInterval(t);
        countdown.classList.add("hidden");
        cb();
      }
    }, 700);
  }

  // AI behavior: step movement + occasional errors so it can "lose"
  function updateAI() {
    // target: center aligned with ball
    let target = ballY + ballSize / 2 - paddleHeight / 2;

    // occasional error / offset depending on difficulty
    let errorChance = difficulty === "easy" ? 0.12 : difficulty === "normal" ? 0.06 : 0.02;
    let errorMag = difficulty === "easy" ? 90 : difficulty === "normal" ? 45 : 18;

    if (Math.random() < errorChance) {
      target += (Math.random() - 0.5) * errorMag * 2; // larger miss sometimes
    } else {
      target += (Math.random() - 0.5) * 8; // small jitter
    }

    // movement speed per frame
    const aiSpeed = difficulty === "easy" ? 3 : difficulty === "normal" ? 4.5 : 6.2;

    // move toward target with step (not easing)
    const currentCenter = rightPaddleY + paddleHeight / 2;
    if (currentCenter < target) rightPaddleY += aiSpeed;
    else if (currentCenter > target) rightPaddleY -= aiSpeed;

    // clamp
    rightPaddleY = clamp(rightPaddleY, 0, canvas.height - paddleHeight);
  }

  // Update & draw loop
  function updateAndRender() {
    if (!gameRunning) return;

    // Player smooth movement (continuous)
    const playerSpeed = difficulty === "easy" ? 6 : difficulty === "normal" ? 7 : 8;
    if ((keys["w"] || keys["arrowup"]) && leftPaddleY > 0) leftPaddleY -= playerSpeed;
    if ((keys["s"] || keys["arrowdown"]) && leftPaddleY + paddleHeight < canvas.height) leftPaddleY += playerSpeed;
    leftPaddleY = clamp(leftPaddleY, 0, canvas.height - paddleHeight);

    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // wall bounce
    if (ballY <= 0) { ballY = 0; ballSpeedY *= -1; }
    if (ballY + ballSize >= canvas.height) { ballY = canvas.height - ballSize; ballSpeedY *= -1; }

    // Paddle collisions: left paddle
    if (ballX <= paddleWidth) {
      if (ballY + ballSize >= leftPaddleY && ballY <= leftPaddleY + paddleHeight) {
        // reflect and add slight randomness so angle changes
        ballX = paddleWidth;
        ballSpeedX = -ballSpeedX * 1.05;
        ballSpeedY += (Math.random() - 0.5) * 1.6;
      }
    }

    // Right paddle collision
    if (ballX + ballSize >= canvas.width - paddleWidth) {
      if (ballY + ballSize >= rightPaddleY && ballY <= rightPaddleY + paddleHeight) {
        ballX = canvas.width - paddleWidth - ballSize;
        ballSpeedX = -ballSpeedX * 1.05;
        ballSpeedY += (Math.random() - 0.5) * 1.2;
      }
    }

    // Score / out-of-bounds
    if (ballX + ballSize < 0) {
      // AI scores
      aiScore++;
      if (aiScore >= 3) endGame(false);
      else resetBall();
    } else if (ballX > canvas.width) {
      // Player scores
      playerScore++;
      if (playerScore > highScore) {
        highScore = playerScore;
        localStorage.setItem("sentient_high", String(highScore));
        highScoreDisplay.innerText = highScore;
      }
      if (playerScore >= 3) endGame(true);
      else resetBall();
    }

    // Update AI after collisions so it responds smoothly
    updateAI();

    // RENDER
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw center dashed line
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles and ball
    drawPaddle(0, leftPaddleY);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY);
    drawBall();

    // Scores
    ctx.fillStyle = "#fff";
    ctx.font = "20px Inter, Arial";
    ctx.fillText(`Player: ${playerScore}`, 24, 28);
    ctx.fillText(`AI: ${aiScore}`, canvas.width - 92, 28);
    ctx.fillText(`High: ${highScore}`, canvas.width / 2 - 28, 28);

    // next frame
    if (gameRunning) requestAnimationFrame(updateAndRender);
  }

  function endGame(playerWon) {
    gameRunning = false;
    canvas.classList.add("hidden");
    gameOver.classList.remove("hidden");
    winnerText.innerText = playerWon ? "🎉 You Win!" : "🤖 AI Wins!";
  }

  // START flow with countdown
  function startGameFlow() {
    // read difficulty
    difficulty = difficultySelect.value || "normal";

    // reset state
    playerScore = 0;
    aiScore = 0;
    resetPaddles();
    resetBall();
    menu.classList.add("hidden");
    gameOver.classList.add("hidden");
    canvas.classList.remove("hidden");

    // run countdown then start loop
    runCountdown(() => {
      gameRunning = true;
      requestAnimationFrame(updateAndRender);
    });
  }

  // Restart -> show menu so user can change difficulty each time
  restartBtn.addEventListener("click", () => {
    gameOver.classList.add("hidden");
    canvas.classList.add("hidden");
    menu.classList.remove("hidden");
  });

  // Bind start
  startBtn.addEventListener("click", startGameFlow);

  // init defaults
  resetPaddles();
  resetBall();
  canvas.classList.add("hidden");
});
