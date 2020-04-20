import * as PIXI from "pixi.js";
import * as Matter from "matter-js";

export class Shape {
  constructor() {
    this._config = {
      position: {
        x: 0,
        y: 0,
      },
      matter_config: {},
      pixi_config: {},
    };
    this._matter = {};
    this._pixi = {};
  }

  isInBounds(rendererBounds) {
    const shapeBounds = this._matter.bounds;
    return Matter.Bounds.overlaps(rendererBounds, shapeBounds);
  }

  setPosition(point = {}) {
    if (this._matter.isStatic) return; // position set onInit ONLY (@TODO: separate)
    Matter.Body.setPosition(this._matter, point);
    this.clearPixi();
    this.doPixi();
  }

  randomizePosition(rendererBounds) {
    this.setPosition({
      x:
        rendererBounds.min.x +
        Math.random() * (rendererBounds.max.x - rendererBounds.min.x),
      y:
        rendererBounds.min.y +
        Math.random() * (rendererBounds.max.y - rendererBounds.min.y),
    });
  }

  doPixi() {
    const matter = this._matter;
    if (!matter.isInitialised) return;

    const pixi = new PIXI.Graphics();
    const config = this._config.pixi_config;
    this._pixi = pixi;
    pixi.initialRotation = -matter.angle;


    this.doPixiStyle();

    const matterParts = matter.parts;
    // Matter draws from center; offseting each
    // part's vertices is very important for
    // accurate pixi drawing.
    const centerPoint = {
      x: matter.position.x,
      y: matter.position.y,
    };

    matterParts.forEach((part) => {
      // For some weird reason parts are an infinite nest.
      if (part.parts.length > 1) return;

      pixi.moveTo(
        part.vertices[0].x - centerPoint.x,
        part.vertices[0].y - centerPoint.y
      );
      for (let i = 1; i < part.vertices.length; i++) {
        pixi.lineTo(
          part.vertices[i].x - centerPoint.x,
          part.vertices[i].y - centerPoint.y
        );
      }
      pixi.closePath();
    });

    config.parentContainer.addChild(pixi);

    pixi.isInitialised = true;
  }

  doPixiStyle() {
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

  clear() {
    this.clearMatter();
    this.clearPixi();
  }

  clearMatter() {
    const matter = this._matter;
    const config = this._config.matter_config;
    if (!matter.isInitialised) return;
    Matter.World.remove(config.parentContainer, matter);
  }

  clearPixi() {
    const pixi = this._pixi;
    const config = this._config.pixi_config;
    if (!pixi.isInitialised) return;
    config.parentContainer.removeChild(pixi);
  }

  onUpdateMatterConfig() {}

  onUpdatePixiConfig() {
    this.clearPixi();
    this.doPixi();
  }

  fromMatterToPixi() {
    const matter = this._matter;
    const pixi = this._pixi;

    // Rotation
    pixi.rotation = pixi.initialRotation + matter.angle;

    // Position
    pixi.position.x = matter.position.x;
    pixi.position.y = matter.position.y;
  }
}
