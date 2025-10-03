const bgCanvas = document.getElementById("bgCanvas");
const bgCtx = bgCanvas.getContext("2d");

function resizeBG() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeBG);
resizeBG();

const sentiImg = new Image();
sentiImg.src = "/assets/senti.png"; // path to your image

const snowParticles = [];

class Snow {
  constructor() {
    this.reset();
  }
  reset() {
    this.size = 25 + Math.random() * 20;
    this.x = Math.random() * bgCanvas.width;
    this.y = -this.size;
    this.speedY = 0.4 + Math.random() * 1.0;
    this.driftX = (Math.random() - 0.5) * 0.3;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.005;
    this.opacity = 0.6 + Math.random() * 0.3;
  }
  update() {
    this.y += this.speedY;
    this.x += this.driftX;
    this.rotation += this.rotationSpeed;

    if (this.y > bgCanvas.height + this.size) {
      this.reset();
      this.y = -this.size;
    }
  }
  draw() {
    bgCtx.save();
    bgCtx.globalAlpha = this.opacity;
    bgCtx.translate(this.x + this.size/2, this.y + this.size/2);
    bgCtx.rotate(this.rotation);
    bgCtx.drawImage(sentiImg, -this.size/2, -this.size/2, this.size, this.size);
    bgCtx.restore();
  }
}

function initSnow() {
  for (let i = 0; i < 15; i++) {
    snowParticles.push(new Snow());
  }
}

function animateSnow() {
  bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
  snowParticles.forEach(s => {
    s.update();
    s.draw();
  });
  requestAnimationFrame(animateSnow);
}

sentiImg.onload = () => {
  initSnow();
  animateSnow();
};
