import * as Matter from "matter-js";

export class Shape {
  constructor() {
    this._config = {
      position: {
        x: 0,
        y: 0
      },
      matter_config: {},
      pixi_config: {}
    };
    this._matter = {};
    this._pixi = {};
  }

  isInBounds(rendererBounds) {
    const shapeBounds = this._matter.bounds;
    return Matter.Bounds.overlaps(rendererBounds, shapeBounds);
  }

  style() {
    const pixi = this._pixi;
    const config = this._config.pixi_config;

    // Fill Style
    if (config.fill) {
      const fillColor = config.fill.color || "0xffffff";
      pixi.beginFill(fillColor);
    }

    // Line Style
    if (config.line) {
      const lineWidth = config.line.width || 1;
      const lineColor = config.line.color || "0xffffff";
      const lineAlpha = config.line.alpha || 1;
      const lineAlignment = 0;
      pixi.lineStyle(lineWidth, lineColor, lineAlpha, lineAlignment);
    }
  }

  fromMatterToPixi() {
    const pixi = this._pixi;
    const matter = this._matter;

    // Rotation
    //Why are we here. Just to suffer.
    pixi.rotation = matter.angle;

    // Position
    pixi.position.x = matter.position.x;
    pixi.position.y = matter.position.y;
  }
}
