import { Shape } from "./_.js";
import * as Matter from "matter-js";
import * as PIXI from "pixi.js";

export class Circle extends Shape {
  constructor({ config } = {}) {
    super({ config });
    this._config = {
      ...this._config,
      radius: 5,
      ...config,
    };
    this.init();
  }

  init() {
    this.doMatter();
    this.doPixi();
  }

  doMatter() {
    const matter = Matter.Bodies.circle(
      this._config.position.x,
      this._config.position.y,
      this._config.radius,
      {
        ...this._config.matter_config,
      }
    );
    this._matter = matter;

    Matter.World.add(this._config.matter_config.parentContainer, matter);

    matter.isInitialised = true;
  }

  doPixi() {
    const matter = this._matter;
    if (!matter.isInitialised) return;

    const pixi = new PIXI.Graphics();
    const config = this._config.pixi_config;
    this._pixi = pixi;
    pixi.initialRotation = -matter.angle;
    this.doPixiStyle();
    // Q: Position has to be "0" to match with Matter updates - but why exactly?
    // A(?):
    // Because "Graphic" can be more than a circle and it's like a bunch of components instead of just the circle?
    // So it has its own position (0,0) - then if I draw the circle at a distance it is nested in the "Graphic" container position.
    // https://github.com/pixijs/pixi.js/issues/2589
    // (!) Circles in PIXI draw from the center
    // https://pixijs.download/dev/docs/PIXI.Graphics.html
    // Use matter instead of radius to account for other things like chamfer
    pixi.drawCircle(0, 0, (matter.bounds.max.x - matter.bounds.min.x) / 2);
    pixi.endFill();

    config.parentContainer.addChild(pixi);

    pixi.isInitialised = true;
  }
}
