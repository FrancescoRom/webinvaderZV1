import { bulletManager } from "./bullet.js";
import { Player, Zombie } from "./entities.js";

let canvas, ctx;
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

  player = new Player(canvas.width / 2, canvas.height - 100);

  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
  window.addEventListener("resize", resizeCanvas);

  // Show buttons after animation
  setTimeout(() => {
    document.querySelector(".buttons").style.display = "block";
    document.getElementById("helpButton").style.display = "block";
  }, 3000); // Adjust timing as needed

  // Start game after logo fade out
  setTimeout(startGame, 5000); // Adjust timing as needed
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  if (player) {
    player.x = Math.min(player.x, canvas.width - player.width);
    player.y = Math.min(player.y, canvas.height - player.height);
  }
}

function handleKeyDown(event) {
  keys[event.code] = true;
  if (event.code === "Space") {
    bulletManager.addBullet(player.x + player.width / 2, player.y);
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
  return new Zombie(x, y);
}

function update() {
  if (!gameRunning) return;

  const currentTime = Date.now();

  if (currentTime - lastZombieSpawn > ZOMBIE_SPAWN_INTERVAL) {
    zombies.push(createZombie());
    lastZombieSpawn = currentTime;
  }

  if (keys["ArrowLeft"]) player.moveLeft();
  if (keys["ArrowRight"]) player.moveRight();
  if (keys["ArrowUp"]) player.moveUp();
  if (keys["ArrowDown"]) player.moveDown();

  player.update();
  bulletManager.updateBullets();

  zombies = zombies.filter((zombie) => {
    zombie.update();
    return zombie.y < canvas.height;
  });

  checkCollisions();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);
  bulletManager.drawBullets(ctx);
  zombies.forEach((zombie) => zombie.draw(ctx));
}

function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();
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
  bulletManager.bullets.forEach((bullet, bulletIndex) => {
    zombies.forEach((zombie, zombieIndex) => {
      if (isColliding(bullet, zombie)) {
        bulletManager.bullets.splice(bulletIndex, 1);
        zombies.splice(zombieIndex, 1);
        // Increase score or handle zombie death
      }
    });
  });

  // Check for collisions between player and zombies
  zombies.forEach((zombie, index) => {
    if (isColliding(player, zombie)) {
      console.log("Player hit by zombie!");
      // Handle player damage or game over
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
