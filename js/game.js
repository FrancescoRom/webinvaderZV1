import { bulletManager } from "./bullet";
import { Player, Zombie } from "./entities";

// game state
let gameRunning = true;
let keys = {};

// create player and starting position
const player = new Player(400, 550);

let zombies = [];

document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
  if (event.code === "Space") {
    bulletManager.addBullet(player.x + player.width / 2, player.y);
  }
  if (event.code === "Escape") {
    togglePause();
  }
});

document.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

function togglePause() {
  gameRunning = !gameRunning;
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

function update() {
  if (!gameRunning) return;

  if (keys["ArrowLeft"]) player.moveLeft();
  if (keys["ArrowRight"]) player.moveRight();
  if (keys["ArrowUp"]) player.moveUp();
  if (keys["ArrowDown"]) player.moveDown();

  bulletManager.updateBullets();

  zombies.forEach((zombie) => zombie.update());

  // implement function
  checkCollisions();
}

function draw() {
  const ctx = document.getElementById("gameCanvas").getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // player
  player.draw(ctx);
  // bullets
  bulletManager.drawBullets(ctx);
  // zombies
  zombies.forEach((zombie) => zombie.draw(ctx));

  // draw UI
  drawUI(ctx);
}

// Main game loop
function gameLoop() {
  update();
  draw();
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Start the game
function startGame() {
  // Initialize game objects, set up initial state
  gameRunning = true;
  requestAnimationFrame(gameLoop);
}

// Implement these functions
function checkCollisions() {
  // Check for collisions between bullets and zombies
  // Check for collisions between player and zombies
}

function drawUI(ctx) {
  // Draw score, health, etc.
}

// Call this when your HTML is loaded
window.onload = startGame;
