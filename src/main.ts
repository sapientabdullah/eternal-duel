import { Fighter } from "./classes/classes";
import { layers } from "./constants/background";
import { gsap } from "gsap";
import "./style.css";
import { rectangularCollision, Winner } from "./utils/utils";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="relative inline-block">
    <div class="absolute flex w-full items-center p-2">
      <div class="relative w-full flex justify-end">
        <div class="bg-red-500 h-[30px] w-full rounded-bl-full"></div>
        <div id="player-health" class="absolute bg-green-500 top-0 right-0 bottom-0 w-full rounded-bl-full border-2 border-yellow-500 border-r-0"></div>
      </div>

      <div id="timer" class="text-white bg-blue-500 rounded-md h-[50px] w-[100px] flex-shrink-0 flex items-center justify-center text-xl border-2 border-yellow-500">10</div>

      <div class="relative w-full">
        <div class="bg-red-500 h-[30px] rounded-br-full"></div>
        <div id="enemy-health" class="absolute bg-green-500 top-0 right-0 bottom-0 left-0 rounded-br-full border-2 border-yellow-500 border-l-0"></div>
      </div>
    </div>
    <div>
        <div id="result" class="absolute text-white items-center justify-center top-0 right-0 bottom-0 left-0 hidden text-5xl">Tie</div>
        <button id="restart" class="absolute w-fit px-6 m-auto top-[60%] right-4 left-4 p-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 hidden">Restart</button>
    </div>
   

    <canvas id="canvas"></canvas>
  </div>
`;

export const canvas = document.querySelector<HTMLCanvasElement>("#canvas");
export const restartBtn = document.querySelector<HTMLButtonElement>("#restart");
const timerEl = document.querySelector<HTMLDivElement>("#timer");
export const resultEl = document.querySelector<HTMLDivElement>("#result");

export let ctx: CanvasRenderingContext2D | null = null;

let [CANVAS_WIDTH, CANVAS_HEIGHT] = [innerWidth, innerHeight];

if (canvas) {
  ctx = canvas.getContext("2d");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
}

window.addEventListener("resize", () => {
  CANVAS_WIDTH = window.innerWidth;
  CANVAS_HEIGHT = window.innerHeight;
  canvas!.width = CANVAS_WIDTH;
  canvas!.height = CANVAS_HEIGHT;
});

export const player = new Fighter({
  position: { x: 50, y: 0 },
  velocity: { x: 0, y: 0 },
  imageSrc: "/Knight 1/Sprites/Idle.png",
  maxFrames: 10,
  scale: 6,
  offset: {
    x: 400,
    y: 550,
  },
  sprites: {
    idle: {
      imageSrc: "/Knight 1/Sprites/Idle.png",
      maxFrames: 10,
    },
    run: {
      imageSrc: "/Knight 1/Sprites/Run.png",
      maxFrames: 8,
    },
    jump: {
      imageSrc: "/Knight 1/Sprites/Jump.png",
      maxFrames: 3,
    },
    fall: {
      imageSrc: "/Knight 1/Sprites/Fall.png",
      maxFrames: 3,
    },
    attack1: {
      imageSrc: "/Knight 1/Sprites/Attack2.png",
      maxFrames: 7,
    },
    takeHit: {
      imageSrc: "/Knight 1/Sprites/Take hit.png",
      maxFrames: 3,
    },
    death: {
      imageSrc: "/Knight 1/Sprites/Death.png",
      maxFrame: 7,
    },
  },
  attackBox: {
    offset: {
      x: 200,
      y: 50,
    },
    width: 200,
    height: 50,
  },
});

export const enemy = new Fighter({
  position: { x: 1200, y: 0 },
  velocity: { x: 0, y: 0 },
  scaleX: -1,
  offset: {
    x: 550,
    y: 782,
  },
  imageSrc: "/Knight 2/Sprites/Idle.png",
  maxFrames: 8,
  scale: 5.0,
  sprites: {
    idle: {
      imageSrc: "/Knight 2/Sprites/Idle.png",
      maxFrames: 8,
    },
    run: {
      imageSrc: "/Knight 2/Sprites/Run.png",
      maxFrames: 8,
    },
    jump: {
      imageSrc: "/Knight 2/Sprites/Jump.png",
      maxFrames: 2,
    },
    fall: {
      imageSrc: "/Knight 2/Sprites/Fall.png",
      maxFrames: 2,
    },
    attack1: {
      imageSrc: "/Knight 2/Sprites/Attack2.png",
      maxFrames: 8,
    },
    takeHit: {
      imageSrc: "/Knight 2/Sprites/Take hit.png",
      maxFrames: 3,
    },
    death: {
      imageSrc: "/Knight 2/Sprites/Death.png",
      maxFrame: 7,
    },
  },
  attackBox: {
    offset: {
      x: 200,
      y: 50,
    },
    width: 200,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

let time = 60;
let timerId: number;
export function decreaseTime(): void {
  if (time > 0) {
    timerId = setTimeout(decreaseTime, 1000);
    time--;
    timerEl!.innerHTML = time.toString();
  }
  if (time === 0) {
    Winner({ player, enemy, timerId });
  }
}
decreaseTime();

function animate(): void {
  ctx?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  layers.forEach(({ layer }) => {
    layer.update();
    layer.draw();
  });
  ctx!.fillStyle = "rgba(255, 255, 255, 0.05)";
  ctx?.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.scaleX = -1;
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.scaleX = 1;
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.scaleX = -1;
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.scaleX = 1;
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    playerAttackSound.currentTime = 0;
    playerAttackSound.play();
    gsap.to("#enemy-health", { duration: 0.5, width: `${enemy.health}%` });
  }

  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    enemyAttackSound.currentTime = 0;
    enemyAttackSound.play();
    gsap.to("#player-health", { duration: 0.5, width: `${player.health}%` });
  }

  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 && !enemy.dead) {
    enemyDeathSound.currentTime = 0;
    enemyDeathSound.play();
    Winner({ player, enemy, timerId });
  }

  if (player.health <= 0 && !player.dead) {
    Winner({ player, enemy, timerId });
    playerDeathSound.currentTime = 0;
    playerDeathSound.play();
  }

  requestAnimationFrame(animate);
}
animate();

addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        playerWooshSound.currentTime = 0;
        playerWooshSound.play();
        break;
    }
  }
  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        playerWooshSound.currentTime = 0;
        enemyWooshSound.play();
        break;
    }
  }
  if (event.key === "f") {
    const app = document.querySelector<HTMLDivElement>("#app");
    if (!document.fullscreenElement) {
      app?.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable fullscreen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  }
});

addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});

const backgroundMusic = new Audio("/audio/music.mp3");
backgroundMusic.volume = 0.5;
backgroundMusic.loop = true;

backgroundMusic.play().catch((error) => {
  console.warn("Autoplay failed. User interaction required:", error);
});

document.addEventListener("keydown", () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
  }
});

const playerWooshSound = new Audio("/audio/woosh.wav");
const playerAttackSound = new Audio("/audio/swordCut.mp3");
const playerDeathSound = new Audio("/audio/playerDeath.mp3");
const enemyWooshSound = new Audio("/audio/enemyWoosh.mp3");
const enemyAttackSound = new Audio("/audio/enemySwordCut.mp3");
const enemyDeathSound = new Audio("/audio/enemyDeath.wav");
playerAttackSound.volume = 0.7;
enemyAttackSound.volume = 0.7;

restartBtn?.addEventListener("click", () => {
  window.location.reload();
});
