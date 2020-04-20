import { Shape } from "./_.js";
import * as Matter from "matter-js";

export class Polygon extends Shape {
  constructor({ config } = {}) {
    super({ config });
    this._config = {
      ...this._config,
      diameter: 10,
      sides: 3,
      ...config
    };
    this.init();
  }

  init() {
    this.doMatter();
    this.doPixi();
  }

  doMatter() {
    const matter = Matter.Bodies.polygon(
      this._config.position.x,
      this._config.position.y,
      this._config.sides,
      this._config.diameter / 2,
      {
        ...this._config.matter_config
      }
    );
    this._matter = matter;

    Matter.World.add(this._config.matter_config.parentContainer, matter);

    matter.isInitialised = true;
  }
}
