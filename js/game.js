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
let gameDifficulty = "Medium"; // Default difficulty
const ZOMBIE_SPAWN_INTERVAL = 1000; // Spawn a new zombie every 2 seconds
let playerHits = 0; // Track the number of times the player is hit
const MAX_PLAYER_HITS = 3; // Maximum hits before game over
let lastHitTime = 0; // Track the last time the player was hit

// Initialize the game
function initGame() {
  // Get the canvas element and its context
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  bulletManagerInstance = new BulletManager();

  // Create a new player instance
  player = new Player(
    canvas.width / 2,
    canvas.height - 150,
    canvas.width,
    canvas.height,
  );

  // Add event listeners for keyboard input and window resize
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("resize", resizeCanvas);

  document
    .getElementById("startButton")
    .addEventListener("click", handleStartGame);
  document.getElementById("pauseGame").style.display = "none";

  // Load images and start the game
  loadAllImages()
    .then(() => {
      // Show buttons after a delay
      setTimeout(() => {
        document.querySelector(".buttons").style.display = "block";
        document.getElementById("helpButton").style.display = "block";
        document.getElementById("leaderboardButton").style.display = "block";
        document.getElementById("settingsButton").style.display = "block";
      }, 3000);
      // Start the game after a delay
      setTimeout(startGame, 5000);
    })
    .catch((error) => {
      console.error("Failed to load images:", error);
    });

  // Retrieve the player's score from local storage
  gameDifficulty = localStorage.getItem("gameDifficulty") || "Medium";
  gameDifficultySettings(gameDifficulty);
  playerScore = getUserScore();
  updateScoreDisplay();
  updatePlayerHPDisplay();
}

// Handles the game difficulty set in settings.html
function gameDifficultySettings(difficulty) {
  switch (difficulty) {
    case "Easy":
      player.speed = 3; // Zombie speed 1
      ZOMBIE_SPAWN_INTERVAL = 3000;
      break;
    case "Medium":
      player.speed = 2; // Zombie speed 1.5
      ZOMBIE_SPAWN_INTERVAL = 2000;
      break;
    case "Hard":
      player.speed = 2.5; // Zombie speed 1.8
      ZOMBIE_SPAWN_INTERVAL = 1000;
      break;
    default:
      player.speed = 2; // Zombie speed 1.5 (default)
      ZOMBIE_SPAWN_INTERVAL = 2000;
      break;
  }
}

// Handle start game function, hide buttons, logo, call resetgame after death and start the game again
function handleStartGame() {
  document.getElementById("startButton").style.display = "none";
  document.getElementById("gameLogo").style.display = "none";
  document.querySelector(".buttons").style.display = "none";
  document.getElementById("helpButton").style.display = "none";

  resetGame();
  startGame();
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
    const bulletStartPosition = player.getBulletStartPosition();
    bulletManagerInstance.addBullet(
      bulletStartPosition.x,
      bulletStartPosition.y,
      player.rotation,
    );
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
    document.getElementById("helpButton").style.display = "none";
    document.getElementById("settingsButton").style.display = "none";
    document.getElementById("leaderboardButton").style.display = "none";
    document.getElementById("pauseGame").style.display = "none";

    requestAnimationFrame(gameLoop);
  } else {
    document.getElementById("helpButton").style.display = "block";
    document.getElementById("settingsButton").style.display = "block";
    document.getElementById("leaderboardButton").style.display = "block";
    document.getElementById("pauseGame").style.display = "block";
  }
}

// Create a new zombie at a random x position at the top of the screen
function createZombie() {
  const x = Math.random() * canvas.width;
  const y = 0; // Start from the top of the screen
  return new Zombie(x, y, gameDifficulty);
}

// Update the game state
function update() {
  if (!gameRunning) return;

  const currentTime = Date.now();

  if (currentTime - lastZombieSpawn > ZOMBIE_SPAWN_INTERVAL) {
    zombies.push(createZombie());
    lastZombieSpawn = currentTime;
  }

  if (keys["ArrowLeft"]) player.move(-1, 0);
  if (keys["ArrowRight"]) player.move(1, 0);
  if (keys["ArrowUp"]) player.move(0, -1);
  if (keys["ArrowDown"]) player.move(0, 1);

  player.update();
  bulletManagerInstance.updateBullets(canvas);

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
  zombies = []; // Clear existing zombies

  // Spawn zombies based on the game difficulty
  let numberOfZombies;
  if (gameDifficulty === "Hard") {
    numberOfZombies = 10;
  } else if (gameDifficulty === "Medium") {
    numberOfZombies = 7;
  } else if (gameDifficulty === "Easy") {
    numberOfZombies = 4;
  } else {
    numberOfZombies = 7;
  }

  for (let i = 0; i < numberOfZombies; i++) {
    zombies.push(createZombie());
  }

  requestAnimationFrame(gameLoop);
}

// Reset the game state
function resetGame() {
  playerHits = 0; // Reset player hits
  lastHitTime = 0; // Reset last hit time
  playerScore = 0; // Reset player score
  zombies = []; // Clear existing zombies
  player.x = canvas.width / 2; // Reset player position
  player.y = canvas.height - 150;
  keys = {};
  updateScoreDisplay();
  updatePlayerHPDisplay();
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
  const currentTime = Date.now();
  zombies.forEach((zombie, index) => {
    if (isColliding(player, zombie)) {
      if (currentTime - lastHitTime > 1500) {
        // 1.5 second cooldown
        playerHits += 1;
        lastHitTime = currentTime;
        console.log(`Player hit by zombie! Hits: ${playerHits}`);
        updatePlayerHPDisplay();
        if (playerHits >= MAX_PLAYER_HITS) {
          endGame(); // End game if HP hits zero
        }
      }
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

// Function to end the game
function endGame() {
  gameRunning = false;
  saveUserScore(playerScore); // Save the score when the game ends
  alert(`Game Over! You killed ${playerScore} zombies!`);
  document.getElementById("startButton").style.display = "block";
  document.getElementById("gameLogo").style.display = "block";
  document.querySelector(".buttons").style.display = "block";
  document.getElementById("helpButton").style.display = "block";
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

// Function to update the player's HP display
function updatePlayerHPDisplay() {
  const hpElement = document.getElementById("playerHP");
  hpElement.textContent = `HP: ${MAX_PLAYER_HITS - playerHits}`;
}

// Initialize the game when the window loads
window.onload = initGame;
