/**
 * background.js
 * Animated, glitch-inspired background with extra particle and glitch effects.
 */

const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
let width, height;
const particles = [];
const numParticles = 120;

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2;
    this.alpha = Math.random() * 0.5 + 0.2;
    this.life = Math.random() * 100 + 50;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life--;
    if (this.life <= 0) this.reset();
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = `hsl(${(Date.now() / 50) % 360}, 100%, 55%)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for (let i = 0; i < numParticles; i++) {
  particles.push(new Particle());
}

function drawGlitch() {
  const glitchCount = 10;  // Fixed count for a consistent effect
  for (let i = 0; i < glitchCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const w = Math.random() * 60 + 20;
    const h = Math.random() * 6 + 1;
    ctx.fillStyle = `hsla(${Math.random() * 360}, 100%, 50%, ${Math.random() * 0.5 + 0.3})`;
    ctx.fillRect(x, y, w, h);
  }
}

function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  ctx.fillRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  if (Math.random() < 0.15) drawGlitch();
  requestAnimationFrame(animate);
}
animate();
