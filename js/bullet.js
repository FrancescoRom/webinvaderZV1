// Bullet dimensions and behavior
class Bullet {
  constructor(x, y, angle, speed = 3.5) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.width = 15;
    this.height = 30;
    this.image = new Image();
    this.image.src = "images/entities/bullet.png";
    this.image.onload = () => {
      console.log("Bullet image loaded successfully");
    };
    this.image.onerror = () => {
      console.error("Failed to load bullet image");
    };
  }

  // Update bullet position based on speed and angle
  update() {
    this.x += this.speed * Math.cos(this.angle - Math.PI / 2);
    this.y += this.speed * Math.sin(this.angle - Math.PI / 2);
    console.log(`Bullet updated to position: (${this.x}, ${this.y})`);
  }

  // Draw the bullet on the canvas
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    );
    ctx.restore();
    console.log(`Bullet drawn at position: (${this.x}, ${this.y})`);
  }

  // Check if the bullet is offscreen
  isOffScreen(canvas) {
    return (
      this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
    );
  }
}

// BulletManager handles bullet logic
export class BulletManager {
  constructor() {
    this.bullets = [];
  }

  // Add a new bullet
  addBullet(playerX, playerY, angle) {
    this.bullets.push(new Bullet(playerX, playerY, angle));
  }

  // Update all bullets and remove offscreen bullets
  updateBullets(canvas) {
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.isOffScreen(canvas)) {
        this.bullets.splice(index, 1);
        console.log(`Bullet removed from position: (${bullet.x}, ${bullet.y})`);
      }
    });
  }

  // Draw all bullets
  drawBullets(ctx) {
    this.bullets.forEach((bullet) => bullet.draw(ctx));
  }
}
