import { Fighter } from "../classes/classes";
import { enemy, restartBtn, resultEl } from "../main";

export function rectangularCollision({
  rectangle1,
  rectangle2,
}: {
  rectangle1: Fighter;
  rectangle2: Fighter;
}): boolean {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      enemy.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

export function Winner({
  player,
  enemy,
  timerId,
}: {
  player: Fighter;
  enemy: Fighter;
  timerId: number;
}): void {
  clearTimeout(timerId);
  resultEl!.style.display = "flex";
  restartBtn!.style.display = "block";
  if (player.health === enemy.health) {
    resultEl!.innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    resultEl!.innerHTML = "Player 1 Won!";
  } else if (player.health < enemy.health) {
    resultEl!.innerHTML = "Player 2 Won!";
  }
}
