import { Layer } from "../classes/classes";

const backgroundLayer1 = "/backgrounds/1.png";
const backgroundLayer2 = "/backgrounds/2.png";
const backgroundLayer3 = "/backgrounds/3.png";
const backgroundLayer4 = "/backgrounds/4.png";
const backgroundLayer5 = "/backgrounds/5.png";
const backgroundLayer6 = "/backgrounds/6.png";
const backgroundLayer7 = "/backgrounds/7.png";
const backgroundLayer8 = "/backgrounds/8.png";
const backgroundLayer9 = "/backgrounds/9.png";

export const layers = [
  { layer: new Layer({ imageSrc: backgroundLayer1, speedModifier: 0.2 }) },
  { layer: new Layer({ imageSrc: backgroundLayer2, speedModifier: 0.4 }) },
  { layer: new Layer({ imageSrc: backgroundLayer3, speedModifier: 0.0 }) },
  { layer: new Layer({ imageSrc: backgroundLayer4, speedModifier: 0.8 }) },
  { layer: new Layer({ imageSrc: backgroundLayer5, speedModifier: 1 }) },
  { layer: new Layer({ imageSrc: backgroundLayer6, speedModifier: 1.2 }) },
  { layer: new Layer({ imageSrc: backgroundLayer7, speedModifier: 1.4 }) },
  { layer: new Layer({ imageSrc: backgroundLayer8, speedModifier: 1.6 }) },
  { layer: new Layer({ imageSrc: backgroundLayer9, speedModifier: 1.8 }) },
];
