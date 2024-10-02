class Bullet {
  constructor(x, y, speed = 5) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 5;
    this.height = 10;
    this.image = new Image();
    this.image.src = "./images/entities/bullet.png";
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

class BulletManager {
  constructor() {
    this.bullets = [];
  }

  addBullet(x, y) {
    this.bullets.push(new Bullet(x, y));
  }

  updateBullet() {
    this.bullets.forEach((bullet) => bullet.update());
    // remove bullets that are offscreen
    this.bullet = this.bullets.filter((bullet) => !bullet.isOffScreen());
  }

  drawBullets(ctx) {
    this.bullets.forEach((bullet) => bullet.draw(ctx));
  }
}

export const bulletManager = new BulletManager();
