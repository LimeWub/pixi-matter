import { Shape } from "./_.js";
import * as Matter from "matter-js";
import * as PIXI from "pixi.js";

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
    // Not Poly coz diff width n height
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

    const pixi = new PIXI.Graphics();
    this._pixi = pixi;
    this.style();

    // Matter draws from center so we know
    // its position we is the center.
    // Very important for pixi line drawing
    const centerPoint = {
      x: matter.position.x,
      y: matter.position.y
    };

    pixi.moveTo(
      matter.vertices[0].x - centerPoint.x,
      matter.vertices[0].y - centerPoint.y
    );
    for (let i = 1; i < matter.vertices.length; i++) {
      pixi.lineTo(
        matter.vertices[i].x - centerPoint.x,
        matter.vertices[i].y - centerPoint.y
      );
    }
    pixi.closePath();
  }
}
