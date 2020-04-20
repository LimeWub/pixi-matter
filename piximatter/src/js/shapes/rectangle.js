import { Shape } from "./_.js";
import * as Matter from "matter-js";

export class Rectangle extends Shape {
  constructor({ config } = {}) {
    super({ config });
    this._config = {
      ...this._config,
      ...config
    };
    this.init();
  }

  init() {
    this.doMatter();
    this.doPixi();
  }

  doMatter() {
    const matter = Matter.Bodies.rectangle(
      this._config.position.x,
      this._config.position.y,
      this._config.width,
      this._config.height,
      {
        ...this._config.matter_config
      }
    );
    this._matter = matter;


    Matter.World.add(this._config.matter_config.parentContainer, matter);
    matter.isInitialised = true;
  }
}
