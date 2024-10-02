import { bulletManager } from "./bullet";
import { Player, Zombie } from "./entities";

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    bulletManager.addBullet(Player.x + Player.width / 2, Player.y);
  }
});
