function smoothMove(current, target, speed) {
  const diff = target - current;
  return current + diff * speed;
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
    rightPaddleY = smoothMove(rightPaddleY, targetY, 0.2); // Smooth slide with easing
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
