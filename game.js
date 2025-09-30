document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const paddleHeight = 100;
  const paddleWidth = 10;
  let leftPaddleY = (canvas.height - paddleHeight) / 2;
  let rightPaddleY = (canvas.height - paddleHeight) / 2;
  let paddleSpeed = 10;

  let ballSize = 30;
  let ballX = canvas.width / 2;
  let ballY = canvas.height / 2;
  let ballSpeedX = 6;
  let ballSpeedY = 4;

  let leftScore = 0;
  let rightScore = 0;

  let dogImage = new Image();
  dogImage.src = "assets/dog.png";

  let gameRunning = false;
  let mode = "ai";

  const speeds = {
    easy: { ballX: 5, ballY: 3 },
    normal: { ballX: 7, ballY: 4 },
    hard: { ballX: 9, ballY: 5 }
  };

  function drawPaddle(x, y) {
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
  }

  function drawBall() {
    ctx.drawImage(dogImage, ballX, ballY, ballSize, ballSize);
  }

  function resetBallPosition() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * Math.abs(ballSpeedY);
  }

  function draw() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    drawPaddle(0, leftPaddleY);
    drawPaddle(canvas.width - paddleWidth, rightPaddleY);

    drawBall();

    ctx.font = "20px Arial";
    ctx.fillText(leftScore, canvas.width / 4, 20);
    ctx.fillText(rightScore, (3 * canvas.width) / 4, 20);

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + ballSize >= canvas.height) ballSpeedY = -ballSpeedY;

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
    

    if (ballX < 0) {
      rightScore++;
      resetBallPosition();
    }
    if (ballX + ballSize > canvas.width) {
      leftScore++;
      resetBallPosition();
    }

    if (mode === "ai") {
      let targetY = ballY - paddleHeight / 2 + ballSize / 2;
      let diff = targetY - rightPaddleY;
      rightPaddleY += diff * 0.15;
    }

    if (leftScore >= 3 || rightScore >= 3) {
      gameRunning = false;
      document.getElementById("gameOver").style.display = "block";
      document.getElementById("winner").innerText =
        leftScore >= 3 ? "Player Wins!" : "AI Wins!";
    } else {
      requestAnimationFrame(draw);
    }
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && leftPaddleY > 0) leftPaddleY -= paddleSpeed;
    if (e.key === "ArrowDown" && leftPaddleY + paddleHeight < canvas.height)
      leftPaddleY += paddleSpeed;

    if (mode === "multiplayer") {
      if (e.key === "w" && rightPaddleY > 0) rightPaddleY -= paddleSpeed;
      if (e.key === "s" && rightPaddleY + paddleHeight < canvas.height)
        rightPaddleY += paddleSpeed;
    }
  });

  document.getElementById("startBtn").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("gameOver").style.display = "none";

    mode = document.getElementById("mode").value;
    let selectedSpeed = document.getElementById("speed").value;

    ballSpeedX = speeds[selectedSpeed].ballX * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = speeds[selectedSpeed].ballY * (Math.random() > 0.5 ? 1 : -1);

    leftScore = 0;
    rightScore = 0;
    gameRunning = true;
    requestAnimationFrame(draw);
  });

  document.getElementById("restartBtn").addEventListener("click", () => {
    document.getElementById("overlay").style.display = "flex";
  });
});

