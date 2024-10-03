import { Player, Zombie, loadAllImages } from "./entities.js";
import { BulletManager } from "./bullet.js";

let canvas, ctx;
let bulletManagerInstance;
let gameRunning = false;
let keys = {};
let player;
let zombies = [];
let lastZombieSpawn = 0;
let playerScore = 0; // Variable to store the player's score
const ZOMBIE_SPAWN_INTERVAL = 3000; // Spawn a new zombie every 3 seconds

// Initialize the game
function initGame() {
  // Get the canvas element and its context
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  bulletManagerInstance = new BulletManager();

  // Create a new player instance
  player = new Player(canvas.width / 2, canvas.height - 150);

  // Add event listeners for keyboard input and window resize
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("resize", resizeCanvas);

  // Load images and start the game
  loadAllImages()
    .then(() => {
      // Show buttons after a delay
      setTimeout(() => {
        document.querySelector(".buttons").style.display = "block";
        document.getElementById("helpButton").style.display = "block";
      }, 3000);
      // Start the game after a delay
      setTimeout(startGame, 5000);
    })
    .catch((error) => {
      console.error("Failed to load images:", error);
    });

  // Retrieve the player's score from local storage
  playerScore = getUserScore();
  updateScoreDisplay();
}

// Resize the canvas to fit the window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (player) {
    player.x = Math.min(player.x, canvas.width - player.width);
    player.y = Math.min(player.y, canvas.height - player.height);
  }
  zombies.forEach((zombie) => {
    zombie.x = Math.min(zombie.x, canvas.width - zombie.width);
    zombie.y = Math.min(zombie.y, canvas.height - zombie.height);
  });
}

// Handle key down events
function handleKeyDown(event) {
  keys[event.code] = true;
  if (event.code === "Space") {
    bulletManagerInstance.addBullet(player.x + player.width / 2, player.y);
  }
  if (event.code === "Escape") {
    togglePause();
  }
}

// Handle key up events
function handleKeyUp(event) {
  keys[event.code] = false;
}

// Toggle the game pause state
function togglePause() {
  gameRunning = !gameRunning;
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

// Create a new zombie at a random x position at the top of the screen
function createZombie() {
  const x = Math.random() * canvas.width;
  const y = 0; // Start from the top of the screen
  console.log("Creating zombie at:", x, y);
  return new Zombie(x, y);
}

// Update the game state
function update() {
  if (!gameRunning) return;

  const currentTime = Date.now();

  // Spawn a new zombie if enough time has passed
  if (currentTime - lastZombieSpawn > ZOMBIE_SPAWN_INTERVAL) {
    zombies.push(createZombie());
    lastZombieSpawn = currentTime;
    console.log("Zombie count:", zombies.length);
  }

  // Update player movement based on keys pressed
  if (keys["ArrowLeft"]) player.move(-1, 0);
  if (keys["ArrowRight"]) player.move(1, 0);
  if (keys["ArrowUp"]) player.move(0, -1);
  if (keys["ArrowDown"]) player.move(0, 1);

  player.update();
  bulletManagerInstance.updateBullets();

  // Update zombies, remove those out of the screen
  zombies = zombies.filter((zombie) => {
    zombie.update(player.x, player.y);
    return zombie.y < canvas.height;
  });

  checkCollisions();
}

// Draw the game state
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  bulletManagerInstance.drawBullets(ctx);
  zombies.forEach((zombie) => zombie.draw(ctx));
}

// Main game loop
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Save the current canvas state
  ctx.save();

  // Reset any transformations and styles
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = "source-over";

  update();
  draw();

  // Restore the canvas state
  ctx.restore();

  requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
  gameRunning = true;
  // Create initial zombies
  for (let i = 0; i < 5; i++) {
    zombies.push(createZombie());
  }
  requestAnimationFrame(gameLoop);
}

// Check for collisions between bullets and zombies, and between player and zombies
function checkCollisions() {
  // Check for collisions between bullets and zombies
  bulletManagerInstance.bullets.forEach((bullet, bulletIndex) => {
    zombies.forEach((zombie, zombieIndex) => {
      if (isColliding(bullet, zombie)) {
        bulletManagerInstance.bullets.splice(bulletIndex, 1); // Remove bullet
        zombies.splice(zombieIndex, 1); // Remove zombie
        playerScore += 1; // Increase score by 1
        saveUserScore(playerScore); // Save the updated score
        updateScoreDisplay(); // Update the score display
      }
    });
  });

  // Check for collisions between player and zombies
  zombies.forEach((zombie, index) => {
    if (isColliding(player, zombie)) {
      console.log("Player hit by zombie!");
      // Handle player damage or game over logic
      gameRunning = false;
      saveUserScore(playerScore); // Save the score when the game ends
    }
  });
}

// Check if two objects are colliding
function isColliding(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// Function to get the user's score from local storage
function getUserScore() {
  return parseInt(localStorage.getItem("userScore")) || 0;
}

// Function to save the user's score in local storage
function saveUserScore(score) {
  localStorage.setItem("userScore", score);
}

// Function to update the score display
function updateScoreDisplay() {
  document.getElementById("score").textContent = `Score: ${playerScore}`;
}

// Initialize the game when the window loads
window.onload = initGame;
