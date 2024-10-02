class Bullet {
  constructor(x, y, speed = 5) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 5;
    this.height = 10;
    this.image = new Image();
    this.image.src = "./images/entities/bullet.png";
    this.image.onload = () => {
      console.log("Bullet image loaded successfully");
    };
    this.image.onerror = () => {
      console.error("Failed to load bullet image");
    };
  }

  update() {
    this.y -= this.speed;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  isOffScreen() {
    return this.y + this.height < 0;
  }
}

export class BulletManager {
  constructor() {
    this.bullets = [];
  }

  addBullet(x, y) {
    this.bullets.push(new Bullet(x, y));
  }

  updateBullets() {
    this.bullets.forEach((bullet) => bullet.update());
    // remove bullets that are offscreen
    this.bullets = this.bullets.filter((bullet) => !bullet.isOffScreen());
  }

  drawBullets(ctx) {
    this.bullets.forEach((bullet) => bullet.draw(ctx));
  }
}
