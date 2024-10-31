const playerWalkImages = [];
const playerShootImage = new Image();
const zombieImages = [];
const zombieImageCount = 4;
const playerWalkImageCount = 3;

// Function to load images into an array
function loadImages(array, prefix, count) {
  for (let i = 1; i <= count; i++) {
    const img = new Image();
    img.src = `./images/entities/${prefix}${i}.png`;
    img.onload = () => {
      console.log(`Loaded ${prefix}${i}.png`);
      array.push(img); // Ensure image is only added to array after it has loaded
    };
    img.onerror = () => console.error(`Failed to load ${prefix}${i}.png`);
  }
}

// Load player walking images and shooting image
loadImages(playerWalkImages, "player", playerWalkImageCount);
playerShootImage.src = "images/entities/player4.png";
playerShootImage.onload = () => console.log("Loaded player4.png");
playerShootImage.onerror = () => console.error("Failed to load player4.png");

// Load zombie images
loadImages(zombieImages, "zombie", zombieImageCount);

// Base class for entities like Player and Zombie
class Entity {
  constructor(x, y, width, height, images) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.images = images;
    this.currentFrame = 0;
    this.frameCount = images.length;
    this.frameDelay = 5;
    this.frameCounter = 0;
    this.rotation = 0;
  }

  // Update the frame for animation
  update() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.frameCounter = 0;
    }
  }

  // Draw the entity on the canvas
  draw(ctx) {
    if (this.images.length > 0) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.rotation);
      ctx.drawImage(
        this.images[this.currentFrame],
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
      );
      ctx.restore();
    }
  }
}

// Player class
class Player extends Entity {
  constructor(x, y, canvasWidth, canvasHeight) {
    super(x, y, 50, 50, playerWalkImages);
    this.speed = 1.5;
    this.isShooting = false;
    this.shootCooldown = 0;
    this.isMoving = false;
    this.lastX = x;
    this.lastY = y;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  // Update player state, including shooting cooldown and animation
  update() {
    if (this.isMoving) {
      super.update();
    }

    if (this.isShooting) {
      this.shootCooldown--;
      if (this.shootCooldown <= 0) {
        this.isShooting = false;
      }
    }

    // Check if the player has actually moved
    this.isMoving = this.x !== this.lastX || this.y !== this.lastY;
    this.lastX = this.x;
    this.lastY = this.y;
  }

  // Draw the player, using shooting image if shooting
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.rotation);
    if (this.isShooting) {
      ctx.drawImage(
        playerShootImage,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
      );
    } else {
      if (this.images.length > 0) {
        ctx.drawImage(
          this.images[this.isMoving ? this.currentFrame : 0],
          -this.width / 2,
          -this.height / 2,
          this.width,
          this.height,
        );
      }
    }
    ctx.restore();
  }

  // Move the player and update rotation
  move(dx, dy) {
    const newX = this.x + dx * this.speed;
    const newY = this.y + dy * this.speed;

    // Boundary checks
    if (newX >= 0 && newX + this.width <= this.canvasWidth) {
      this.x = newX;
    }
    if (newY >= 0 && newY + this.height <= this.canvasHeight) {
      this.y = newY;
    }

    if (dx !== 0 || dy !== 0) {
      this.rotation = Math.atan2(dy, dx) + Math.PI / 2; // Adjust the angle by 90 degrees (π/2 radians)
    }
  }

  // Handle shooting action
  shoot(targetX, targetY) {
    if (!this.isShooting) {
      this.isShooting = true;
      this.shootCooldown = 20;
      const dx = targetX - (this.x + this.width / 2);
      const dy = targetY - (this.y + this.height / 2);
      this.rotation = Math.atan2(dy, dx) + Math.PI / 2; // Adjust the angle by 90 degrees (π/2 radians)
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2,
        angle: this.rotation,
      };
    }
    return null;
  }

  // Get the bullet's starting position based on the players rotation
  getBulletStartPosition() {
    const bulletOffset = this.width / 2;
    const bulletX =
      this.x +
      this.width / 2 +
      bulletOffset * Math.cos(this.rotation - Math.PI / 2);
    const bulletY =
      this.y +
      this.height / 2 +
      bulletOffset * Math.sin(this.rotation - Math.PI / 2);
    return {
      x: bulletX,
      y: bulletY,
    };
  }
}

// Zombie class extending Entity
class Zombie extends Entity {
  constructor(x, y, difficulty) {
    super(x, y, 40, 40, zombieImages);
    this.speed = 1.2;
    this.difficulty = difficulty;
    this.setDifficultySettings();
  }
  // Zombie speed based on dfficulty
  setDifficultySettings() {
    switch (this.difficulty) {
      case "Easy":
        this.speed = 0.8;
        break;
      case "Medium":
        this.speed = 1.2;
        break;
      case "Hard":
        this.speed = 1.5;
        break;
      default:
        this.speed = 1.2;
        break;
    }
  }

  // Update zombie state, including movement towards player
  update(playerX, playerY) {
    super.update();
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
      this.rotation = Math.atan2(dy, dx) - Math.PI / 2; // Adjust the angle by -90 degrees (-π/2 radians)
    }
  }
}

// Function to load all images and resolve a promise when done
function loadAllImages() {
  return new Promise((resolve) => {
    const totalImages = playerWalkImageCount + zombieImageCount + 1;
    let loadedImages = 0;

    function onImageLoad() {
      loadedImages++;
      if (loadedImages === totalImages) {
        resolve();
      }
    }

    playerWalkImages.forEach((img) => (img.onload = onImageLoad));
    zombieImages.forEach((img) => (img.onload = onImageLoad));
    playerShootImage.onload = onImageLoad;
  });
}

export { Player, Zombie, loadAllImages };
