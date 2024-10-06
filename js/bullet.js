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

  update() {
    this.x += this.speed * Math.cos(this.angle - Math.PI / 2);
    this.y += this.speed * Math.sin(this.angle - Math.PI / 2);
  }

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
  }

  isOffScreen(canvas) {
    return (
      this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
    );
  }
}

export class BulletManager {
  constructor() {
    this.bullets = [];
  }

  addBullet(playerX, playerY, angle) {
    this.bullets.push(new Bullet(playerX, playerY, angle));
  }

  updateBullets(canvas) {
    this.bullets.forEach((bullet, index) => {
      bullet.update();
      if (bullet.isOffScreen(canvas)) {
        this.bullets.splice(index, 1);
      }
    });
  }

  drawBullets(ctx) {
    this.bullets.forEach((bullet) => bullet.draw(ctx));
  }
}
