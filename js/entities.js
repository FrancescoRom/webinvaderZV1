const playerWalkImages = [];
const playerShootImage = new Image();
const zombieImages = [];
const zombieImageCount = 4;
const playerWalkImageCount = 3;

function loadImages(array, prefix, count) {
  for (let i = 1; i <= count; i++) {
    const img = new Image();
    img.src = `./images/entities/${prefix}${i}.png`;
    img.onload = () => {
      console.log(`Loaded ${prefix}${i}.png`);
      array.push(img); // Move this inside onload to ensure it's only pushed when loaded
    };
    img.onerror = () => console.error(`Failed to load ${prefix}${i}.png`);
  }
}

loadImages(playerWalkImages, "player", playerWalkImageCount);
playerShootImage.src = "./images/entities/player4.png";
playerShootImage.onload = () => console.log("Loaded player4.png");
playerShootImage.onerror = () => console.error("Failed to load player4.png");
loadImages(zombieImages, "zombie", zombieImageCount);

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

  update() {
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.currentFrame = (this.currentFrame + 1) % this.frameCount;
      this.frameCounter = 0;
    }
  }

  draw(ctx) {
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

class Player extends Entity {
  constructor(x, y) {
    super(x, y, 50, 50, playerWalkImages);
    this.speed = 5;
    this.isShooting = false;
    this.shootCooldown = 0;
  }

  update() {
    super.update();
    if (this.isShooting) {
      this.shootCooldown--;
      if (this.shootCooldown <= 0) {
        this.isShooting = false;
      }
    }
  }

  draw(ctx) {
    if (this.isShooting) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.rotate(this.rotation);
      ctx.drawImage(
        playerShootImage,
        -this.width / 2,
        -this.height / 2,
        this.width,
        this.height,
      );
      ctx.restore();
    } else {
      super.draw(ctx);
    }
  }

  move(dx, dy) {
    this.x += dx * this.speed;
    this.y += dy * this.speed;
    if (dx !== 0 || dy !== 0) {
      this.rotation = Math.atan2(dy, dx) + Math.PI / 2; // Adjust the angle by 90 degrees (π/2 radians)
    }
  }

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
}

class Zombie extends Entity {
  constructor(x, y) {
    super(x, y, 40, 40, zombieImages);
    this.speed = 1;
  }

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
