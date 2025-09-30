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
