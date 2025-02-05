/**
 * script.js
 * Simplified cigarette counting logic with a single game timer and enhanced animations.
 */

const MAX_CIGS = 20;
let cigsLeft = MAX_CIGS;
let health = 100;
let achievementUnlocked = false;
let canSmoke = true;            // Cooldown flag
let cooldownTime = 1000;        // 1 second cooldown between smokes
let gameStartTime = Date.now(); // Game timer start
let paused = false;             // Pause flag

// Restore state from localStorage if available
function restoreState() {
  const savedState = localStorage.getItem('retrobuffState');
  if (savedState) {
    const state = JSON.parse(savedState);
    cigsLeft = state.cigsLeft;
    health = state.health;
    achievementUnlocked = state.achievementUnlocked;
    gameStartTime = state.gameStartTime || Date.now();
  }
}

// Save current state to localStorage
function saveState() {
  const state = { cigsLeft, health, achievementUnlocked, gameStartTime };
  localStorage.setItem('retrobuffState', JSON.stringify(state));
}

// Create cigarette elements in the grid
function createCigarettes() {
  const grid = document.getElementById('cigGrid');
  grid.innerHTML = '';
  for (let i = 0; i < MAX_CIGS; i++) {
    const cig = document.createElement('div');
    cig.className = 'cigarette';
    if (i >= cigsLeft) {
      cig.classList.add('burned');
    } else {
      cig.addEventListener('click', smokeCigarette);
    }
    grid.appendChild(cig);
  }
}

// Function called when a cigarette is smoked
function smokeCigarette(e) {
  if (!canSmoke || paused) return;
  if (cigsLeft <= 0 || e.target.classList.contains('burned')) return;
  
  // Restart the game timer each time a cigarette is clicked
  gameStartTime = Date.now();
  updateGameTimer();

  canSmoke = false;
  updateCooldownDisplay("Cooling...");
  setTimeout(() => {
    if (!paused) {
      canSmoke = true;
      updateCooldownDisplay("Ready");
    }
  }, cooldownTime);
  
  // Create small flame fire animation on cigarette consumption
  const flame = document.createElement('div');
  flame.className = 'flame';
  flame.style.left = `${e.clientX - 10}px`;
  flame.style.top = `${e.clientY - 40}px`;
  document.body.appendChild(flame);
  setTimeout(() => flame.remove(), 500);
  
  // Mark cigarette as burned and update count
  e.target.classList.add('burned');
  cigsLeft--;
  
  // Calculate health decrease (each cigarette reduces health proportionally)
  const damage = 100 / MAX_CIGS;
  health = Math.max(0, health - damage);
  
  playSound('smokeSound');
  createSmoke(e.clientX, e.clientY);
  createAshParticle();
  
  updateDisplay();
  updateGameTimer();
  saveState();
  
  // Achievements when half or fewer cigarettes remain
  if (!achievementUnlocked && cigsLeft <= MAX_CIGS / 2) {
    achievementUnlocked = true;
    showAchievement("Achievement: Smoker's Paradise!");
    playSound('achievementSound');
    launchFireworks();
  }
  
  if (cigsLeft === 0) {
    setTimeout(gameOver, 500);
  }
}

// Create a smoke element at a given coordinate
function createSmoke(x, y) {
  const smoke = document.createElement('div');
  smoke.className = 'smoke';
  smoke.style.left = `${x}px`;
  smoke.style.top = `${y}px`;
  document.body.appendChild(smoke);
  setTimeout(() => smoke.remove(), 1300);
}

// Create an ash particle in the ash tray
function createAshParticle() {
  const ashTray = document.querySelector('.ash-tray');
  const ash = document.createElement('div');
  ash.className = 'ash';
  ash.style.left = `${Math.random() * (ashTray.offsetWidth - 5)}px`;
  ashTray.appendChild(ash);
  setTimeout(() => ash.remove(), 2000);
}

// Update on-screen display for count and health
function updateDisplay() {
  document.getElementById('count').textContent = cigsLeft;
  document.getElementById('healthBar').style.width = `${health}%`;
  const warningBanner = document.querySelector('.warning-banner');
  warningBanner.style.animation = health < 30 ? 'warningPulse 0.5s infinite' : 'warningPulse 1s infinite';
}

// Update game timer display
function updateGameTimer() {
  const gameTimerEl = document.getElementById('gameTimer');
  const elapsed = Date.now() - gameStartTime;
  gameTimerEl.textContent = formatElapsedTime(elapsed);
}

// Game over effects
function gameOver() {
  const lung = document.getElementById('burntLung');
  lung.classList.add('show');
  document.body.classList.add('game-over');
  playSound('reloadSound');
  // Alert message removed so the page won't freeze or show a popup.
  // You can add any alternative notification here if desired.
}

// Reset the app to its initial state
function resetSystem() {
  cigsLeft = MAX_CIGS;
  health = 100;
  achievementUnlocked = false;
  gameStartTime = Date.now();
  saveState();
  createCigarettes();
  updateDisplay();
  document.querySelector('.warning-banner').style.animation = '';
  document.body.classList.remove('game-over');
  document.getElementById('burntLung').classList.remove('show');
  playSound('reloadSound');
  updateCooldownDisplay("Ready");
  updateGameTimer();
}

// Show achievement popup
function showAchievement(message) {
  const achievement = document.getElementById('achievement');
  achievement.textContent = message;
  achievement.classList.add('show');
  setTimeout(() => achievement.classList.remove('show'), 3000);
}

// Play a sound by its element ID
function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(err => console.log(`Sound playback error: ${err}`));
  }
}

// Update cooldown display text
function updateCooldownDisplay(text) {
  document.getElementById('cooldownDisplay').textContent = text;
}

// Format elapsed time as d:hh:mm:ss
function formatElapsedTime(elapsedMs) {
  const totalSeconds = Math.floor(elapsedMs / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Update game timer every second
setInterval(() => { if (!paused) updateGameTimer(); }, 1000);

// Fireworks animation for achievements
function launchFireworks() {
  let fireworksContainer = document.querySelector('.fireworks');
  if (!fireworksContainer) {
    fireworksContainer = document.createElement('div');
    fireworksContainer.className = 'fireworks';
    document.body.appendChild(fireworksContainer);
  }
  for (let i = 0; i < 40; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.width = '6px';
    particle.style.height = '6px';
    particle.style.background = `hsl(${Math.random() * 360}, 100%, 60%)`;
    particle.style.borderRadius = '50%';
    particle.style.opacity = 1;
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.transition = 'all 1.2s ease-out';
    fireworksContainer.appendChild(particle);
    setTimeout(() => {
      particle.style.opacity = 0;
      particle.style.transform = `translate(${(Math.random() - 0.5) * 250}px, ${(Math.random() - 0.5) * 250}px) scale(1.5)`;
      setTimeout(() => particle.remove(), 1200);
    }, 50 * i);
  }
  setTimeout(() => fireworksContainer.remove(), 1800);
}

// Pause/Resume functionality
function togglePause() {
  paused = !paused;
  const pauseBtn = document.getElementById('pauseBtn');
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  document.body.classList.toggle('paused', paused);
}

window.addEventListener('beforeunload', saveState);

// Initialize the app
restoreState();
createCigarettes();
updateDisplay();
updateGameTimer();
document.getElementById('resetBtn').addEventListener('click', resetSystem);
updateCooldownDisplay("Ready");
