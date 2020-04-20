import { Shape } from "./_.js";
import * as Matter from "matter-js";

import decomp from 'poly-decomp';
window.decomp = decomp;

export class Vertices extends Shape {
  constructor({ config } = {}) {
    super({ config });
    this._config = {
      ...this._config,
      ...config,
    };
    this.init();
  }

  init() {
    this.doMatter();
    this.doPixi();
  }

  doMatter() {
    const matter = Matter.Bodies.fromVertices(
      this._config.position.x,
      this._config.position.y,
      this._config.vertices,
      {
        ...this._config.matter_config,
      }
    );
    this._matter = matter;
    Matter.World.add(this._config.matter_config.parentContainer, matter);
    matter.isInitialised = true;
  }
}
