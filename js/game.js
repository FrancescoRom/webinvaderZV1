import { Player, Zombie, loadAllImages } from "./entities.js";
import { BulletManager } from "./bullet.js";

let canvas, ctx;
let bulletManagerInstance;
let gameRunning = false;
let keys = {};
let player;
let zombies = [];
let lastZombieSpawn = 0;
const ZOMBIE_SPAWN_INTERVAL = 3000; // Spawn a new zombie every 3 seconds

function initGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  resizeCanvas();
  bulletManagerInstance = new BulletManager();

  player = new Player(canvas.width / 2, canvas.height - 150);

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("resize", resizeCanvas);

  // Load images and start the game
  loadAllImages()
    .then(() => {
      setTimeout(() => {
        document.querySelector(".buttons").style.display = "block";
        document.getElementById("helpButton").style.display = "block";
      }, 3000);
      setTimeout(startGame, 5000);
    })
    .catch((error) => {
      console.error("Failed to load images:", error);
    });
}

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

function handleKeyDown(event) {
  keys[event.code] = true;
  if (event.code === "Space") {
    bulletManagerInstance.addBullet(player.x + player.width / 2, player.y);
  }
  if (event.code === "Escape") {
    togglePause();
  }
}

function handleKeyUp(event) {
  keys[event.code] = false;
}

function togglePause() {
  gameRunning = !gameRunning;
  if (gameRunning) {
    requestAnimationFrame(gameLoop);
  }
}

function createZombie() {
  const x = Math.random() * canvas.width;
  const y = 0; // Start from the top of the screen
  console.log("Creating zombie at:", x, y);
  return new Zombie(x, y);
}

function update() {
  if (!gameRunning) return;

  const currentTime = Date.now();

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

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  bulletManagerInstance.drawBullets(ctx);
  zombies.forEach((zombie) => zombie.draw(ctx));
}

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

function startGame() {
  gameRunning = true;
  // Create initial zombies
  for (let i = 0; i < 5; i++) {
    zombies.push(createZombie());
  }
  requestAnimationFrame(gameLoop);
}

function checkCollisions() {
  // Check for collisions between bullets and zombies
  bulletManagerInstance.bullets.forEach((bullet, bulletIndex) => {
    zombies.forEach((zombie, zombieIndex) => {
      if (isColliding(bullet, zombie)) {
        bulletManagerInstance.bullets.splice(bulletIndex, 1); // Remove bullet
        zombies.splice(zombieIndex, 1); // Remove zombie
        // Increase score or handle zombie death
      }
    });
  });

  // Check for collisions between player and zombies
  zombies.forEach((zombie, index) => {
    if (isColliding(player, zombie)) {
      console.log("Player hit by zombie!");
      // Handle player damage or game over logic
    }
  });
}

function isColliding(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

window.onload = initGame;
