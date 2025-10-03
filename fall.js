// fall.js - Sentient snowfall background
const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

const sentiImg = new Image();
sentiImg.src = "./assets/senti1.jpg"; // path to your ball png

let flakes = [];
const MAX_FLAKES = 15; // keep it low for "snow-like" effect

class Flake {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * bgCanvas.width;
    this.y = -50;
    this.size = 24 + Math.random() * 20; // varied sizes
    this.speedY = 0.5 + Math.random() * 1.2; // smooth fall
    this.speedX = (Math.random() - 0.5) * 0.3; // gentle drift
  }
  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    if (this.y > bgCanvas.height + 40) this.reset();
  }
  draw() {
    if (sentiImg.complete) {
      bgCtx.drawImage(sentiImg, this.x, this.y, this.size, this.size);
    }
  }
}

// initialize
for (let i = 0; i < MAX_FLAKES; i++) {
  flakes.push(new Flake());
}

function animate() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  flakes.forEach(flake => {
    flake.update();
    flake.draw();
  });
  requestAnimationFrame(animate);
}

animate();

// resize handling
window.addEventListener("resize", () => {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
});
