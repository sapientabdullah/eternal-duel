import { canvas, ctx } from "../main";

const gravity = 0.7;
const groundPos = 0;
let gameSpeed = 5;

export class Sprite {
  scaleX: number;
  position: Position;
  width: Width;
  height: Height;
  image: HTMLImageElement;
  scale: Scale;
  maxFrames: Frame;
  currentFrame: Frame;
  elapsedFrames: Frame;
  holdFrames: Frame;
  offset: Position;
  sprites: Sprites;
  constructor({
    position,
    imageSrc,
    width = 1024,
    height = 576,
    scale = 1,
    maxFrames = 1,
    offset = { x: 0, y: 0 },
    sprites = {
      idle: {
        imageSrc,
        maxFrames,
      },
    },
    scaleX = 1,
  }: {
    position: Position;
    imageSrc: ImageSrc;
    width?: Width;
    height?: Height;
    scale?: Scale;
    maxFrames?: Frame;
    offset?: Position;
    sprites?: Sprites;
    scaleX?: number;
  }) {
    this.position = position;
    this.height = height;
    this.width = width;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.maxFrames = maxFrames;
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.holdFrames = 5;
    this.offset = offset;
    this.sprites = sprites;
    this.scaleX = scaleX;
  }
  draw() {
    ctx?.save();

    if (this.scaleX === -1) {
      ctx?.scale(-1, 1);
      ctx?.drawImage(
        this.image,
        this.currentFrame * (this.image.width / this.maxFrames),
        0,
        this.image.width / this.maxFrames,
        this.image.height,
        -(
          this.position.x +
          (this.image.width / this.maxFrames) * this.scale -
          this.offset.x
        ),
        this.position.y - this.offset.y,
        (this.image.width / this.maxFrames) * this.scale,
        this.image.height * this.scale
      );
    } else {
      ctx?.drawImage(
        this.image,
        this.currentFrame * (this.image.width / this.maxFrames),
        0,
        this.image.width / this.maxFrames,
        this.image.height,
        this.position.x - this.offset.x,
        this.position.y - this.offset.y,
        (this.image.width / this.maxFrames) * this.scale,
        this.image.height * this.scale
      );
    }

    ctx?.restore();
  }
  animateFrames() {
    this.elapsedFrames++;
    if (this.elapsedFrames % this.holdFrames === 0) {
      if (this.currentFrame < this.maxFrames - 1) {
        this.currentFrame++;
      } else {
        this.currentFrame = 0;
      }
    }
  }
  update() {
    this.draw();
    this.animateFrames();
  }
}

export class Fighter extends Sprite {
  velocity: Velocity;
  height: Height;
  width: Width;
  lastKey: LastKey;
  attackBox: AttackBox;
  isAttacking: boolean;
  health: Health;
  sprites: any;
  dead: boolean;
  constructor({
    position,
    velocity,
    height = 150,
    imageSrc,
    scale = 1,
    maxFrames = 1,
    offset = { x: 0, y: 0 },
    scaleX = 1,
    sprites,
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
  }: {
    position: Position;
    velocity: Velocity;
    height?: Height;
    offset: Position;
    imageSrc: ImageSrc;
    scale?: Scale;
    maxFrames?: Frame;
    sprites: Sprites;
    scaleX?: number;
    attackBox: any;
  }) {
    super({
      position,
      imageSrc,
      scale,
      maxFrames,
      offset,
      scaleX,
    });
    this.velocity = velocity;
    this.height = height;
    this.width = 200;
    this.lastKey = "";
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.isAttacking = false;
    this.health = 100;
    this.currentFrame = 0;
    this.elapsedFrames = 0;
    this.holdFrames = 5;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      this.sprites[sprite].image = new Image();
      this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
    }
  }

  update() {
    // ctx!.fillStyle = "rgba(0, 255, 0, 1)";
    // ctx?.fillRect(this.position.x, this.position.y, this.width, this.height);

    this.draw();
    if (!this.dead) {
      this.animateFrames();
    }

    if (this.scaleX === -1) {
      this.attackBox.position.x =
        this.position.x +
        this.width -
        this.attackBox.offset.x -
        this.attackBox.width;
    } else {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    }
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    // ctx!.fillStyle = "red";
    // ctx?.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height >= canvas!.height - groundPos) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
    console.log(this.position.y);
  }
  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }
  takeHit() {
    this.health -= 10;
    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }
  switchSprite(sprite: Sprites) {
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.maxFrame - 1) {
        this.dead = true;
      }
      return;
    }
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.maxFrames - 1
    ) {
      return;
    }

    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.maxFrames - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.maxFrames = this.sprites.idle.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.maxFrames = this.sprites.run.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.maxFrames = this.sprites.jump.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.maxFrames = this.sprites.fall.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.maxFrames = this.sprites.attack1.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.maxFrames = this.sprites.takeHit.maxFrames;
          this.currentFrame = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.maxFrames = this.sprites.death.maxFrame;
          this.currentFrame = 0;
        }
        break;
    }
  }
}

export class Layer {
  position: Position;
  image: HTMLImageElement;
  width: Width;
  height: Height;
  speedModifier: SpeedModifier;
  speed: Speed;
  constructor({
    imageSrc,
    speedModifier,
  }: {
    imageSrc: ImageSrc;
    speedModifier: SpeedModifier;
  }) {
    this.position = { x: 0, y: 0 };
    this.width = innerWidth;
    this.height = innerHeight;
    this.image = new Image();
    this.image.src = imageSrc;
    this.speedModifier = speedModifier;
    this.speed = gameSpeed * this.speedModifier;
  }
  update() {
    this.speed = gameSpeed * this.speedModifier;
    if (this.position.x <= -this.width) {
      this.position.x = 0;
    }
    this.position.x = this.position.x - this.speed;
  }
  draw() {
    ctx?.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    ctx?.drawImage(
      this.image,
      this.position.x + this.width,
      this.position.y,
      this.width,
      this.height
    );
  }
}
