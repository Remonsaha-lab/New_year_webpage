import './style.css'

// Starry Background
function createStars() {
  const count = 200;
  const body = document.body;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.width = `${Math.random() * 3}px`;
    star.style.height = star.style.width;
    star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
    body.appendChild(star);
  }
}

createStars();

// Particle Animation
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.size = Math.random() * 2 + 1;
    // Explosion effect: start with high speed
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 10 + 5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    
    this.friction = 0.94;
    this.ease = 0.08;
    // Gold/Fire colors
    this.color = `hsl(${Math.random() * 40 + 30}, 100%, ${Math.random() * 30 + 50}%)`;
  }

  update() {
    // Physics for explosion
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= this.friction;
    this.vy *= this.friction;

    // Move towards target (homing)
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    
    this.x += dx * this.ease;
    this.y += dy * this.ease;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  
  // Draw text to offscreen canvas to get pixel data
  const text = "Happy New Year 2026";
  // Responsive font size
  const fontSize = Math.min(window.innerWidth / 10, 100);
  
  ctx.font = `bold ${fontSize}px Inter, sans-serif`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 50; 
  
  ctx.fillText(text, centerX, centerY);
  
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const data = imageData.data;
  const step = 5; // Density of particles
  
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      const index = (y * canvas.width + x) * 4;
      const alpha = data[index + 3];
      
      if (alpha > 128) {
        // Start from center (button position)
        const startX = canvas.width / 2;
        const startY = canvas.height / 2;
        
        particles.push(new Particle(startX, startY, x, y));
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  animationId = requestAnimationFrame(animate);
}

// Interaction
const btn = document.getElementById('click-btn');
const quoteContainer = document.getElementById('quote-container');
const greeting = document.getElementById('greeting');

// Hide greeting initially so particles form it first
greeting.style.opacity = '0';

btn.addEventListener('click', () => {
  btn.style.opacity = '0';
  btn.style.pointerEvents = 'none';
  
  initParticles();
  animate();
  
  // Show quote and solidify text
  setTimeout(() => {
    quoteContainer.classList.remove('hidden');
    quoteContainer.classList.add('visible');
    
    // Fade in the solid text over the particles
    setTimeout(() => {
        greeting.style.transition = 'opacity 2s ease';
        greeting.style.opacity = '1';
    }, 1500);
    
  }, 1000);
});
