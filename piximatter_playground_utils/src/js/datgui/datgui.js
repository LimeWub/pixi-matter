import * as dat from "dat.gui";
// Christ
// https://workshop.chromeexperiments.com/examples/guiVR/#1--Basic-Usage
// https://codepen.io/supah/pen/prVVOx?editors=0010

// SVG?: https://stackoverflow.com/questions/23417991/load-a-file-using-a-dat-gui-button

// https://github.com/dataarts/dat.gui/blob/master/API.md

// dat boi needs the f l a t
const settings = [{ name: "bg", type: "lines" }];

export class PixiMatterGui {
  constructor({ PixiMatterObject: pmo }) {
    this._pmo = pmo;
    this.init();
  }

  init() {
    this.gui = new dat.GUI({ autoPlace: false, useLocalStorage: true });
    this.gui.domElement.style.cssText = `${this.gui.domElement.style.cssText};
    max-height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    position: absolute;
    right: 0;
    top: 0;
    `;
    this._pmo._dom.element.appendChild(this.gui.domElement);

    this.initGUISkeleton();
    this.initMetrics();
    this.initAddShape();
    this.initWorld();
  }

  initGUISkeleton() {
    console.log(this.gui);
    // [Metrics]
    this.guiMetrics = this.gui.addFolder("Metrics");
    // [Add Shape]
    this.guiAddShape = this.gui.addFolder("Add Shape");
    this.guiAddShapeMatter = this.guiAddShape.addFolder("Matter");
    this.guiAddShapePixi = this.guiAddShape.addFolder("Pixi");
    // [World]
    this.guiWorld = this.gui.addFolder("World");
    this.guiWorldGravity = this.guiWorld.addFolder("Gravity");
    this.guiWorldEngine = this.guiWorld.addFolder("Engine");
  }

  // [Metrics]
  initMetrics() {
    this.initMetricsConfig();
    this.setupMetricsFields();
    this.guiMetrics.open();

    // tmp
    this.removeMetricsFields();
  }

  initMetricsConfig() {
    this.metrics = {
      fps: 60,
      debug: false,
    };
  }

  setupMetricsFields() {
    const guiMetrics = this.guiMetrics;
    guiMetrics
      .add(this.metrics, "fps", 0, 120)
      .onFinishChange(() => console.log("fps"));
    guiMetrics
      .add(this.metrics, "debug")
      .onFinishChange(() => console.log("toggleDebug"));
  }

  removeMetricsFields() {
    const guiMetrics = this.guiMetrics;
    console.log({ guiMetrics }); // @TODO
  }

  // [Add Shape]
  initAddShape() {
    this.initAddShapeConfig();
    this.initAddShapeMatterConfig();
    this.initAddShapePixiConfig();
    this.setupAddShapeFields();
  }

  initAddShapeConfig() {
    this.addShape = {
      amount: 1,
      type: "circle",
      addShape: () => {
        console.log("addShape");
      },
    };
  }

  initAddShapeMatterConfig() {
    this.addShapeMatter = {
      density: 0.001,
      friction: 0.1,
      frictionStatic: 0.5,
      frictionAir: 0.01,
      restitution: 0,
      chamfer: 0,
    };
  }

  initAddShapePixiConfig() {
    this.addShapePixi = {
      fillColor: "#FFFFFF",
      fillAlpha: 1,
      lineColor: "#000000",
      lineAlpha: 0,
      lineWidth: 1,
    };
  }

  setupAddShapeFields() {
    const guiAddShape = this.guiAddShape;
    guiAddShape
      .add(this.addShape, "amount", 0, 10, 1)
      .onFinishChange(() => console.log("amount"));
    const dd = guiAddShape
      .add(this.addShape, "type", [
        "circle",
        "rectangle",
        "polygon",
        "vertices",
      ])
      .onFinishChange(() =>
        console.log("removeAddShapeMatterFields, setupAddShapeMatterFields")
      );
    dd.setValue("circle"); // pls

    this.setupAddShapeMatterFields({});
    this.setupAddShapePixiFields();

    // *addShape*
    guiAddShape.add(this.addShape, "addShape");
  }

  setupAddShapeMatterFields({ type }) {
    const guiAddShapeMatter = this.guiAddShapeMatter;

    switch (type) {
      case "rectangle":
        this.addShapeMatterType = {
          width: 10,
          height: 10,
        };
        guiAddShapeMatter.add(this.addShapeMatterType, "width", 1, 100, 1);
        guiAddShapeMatter.add(this.addShapeMatterType, "height", 1, 100, 1);
        break;
      case "trapezoid":
        this.addShapeMatterType = {
          width: 10,
          height: 10,
          slope: 1,
        };
        guiAddShapeMatter.add(this.addShapeMatterType, "width", 1, 100, 1);
        guiAddShapeMatter.add(this.addShapeMatterType, "height", 1, 100, 1);
        guiAddShapeMatter.add(this.addShapeMatterType, "slope", 0, 10, 0.5);
        break;
      case "polygon":
        this.addShapeMatterType = {
          sides: 3,
          radius: 5,
        };
        guiAddShapeMatter.add(this.addShapeMatterType, "sides", 1, 12, 1);
        guiAddShapeMatter.add(this.addShapeMatterType, "radius", 1, 50, 1);
        break;
      case "vertices":
        this.addShapeMatterType = {
          path: "", // ???
          width: 10, // something to do with scale? place, get size, adjust scale for width fit?
        };
        guiAddShapeMatter.add(this.addShapeMatterType, "path");
        guiAddShapeMatter.add(this.addShapeMatterType, "width", 1, 100, 1);
        break;
      case "circle":
      default:
        this.addShapeMatterType = {
          radius: 5,
        };
        guiAddShapeMatter.add(this.addShapeMatterType, "radius", 1, 50, 1);
    }
    // this.addShapeMatterPosition?

    guiAddShapeMatter.add(this.addShapeMatter, "density", 0, 0.01, 0.005);
    guiAddShapeMatter.add(this.addShapeMatter, "friction", 0, 1, 0.05);
    guiAddShapeMatter.add(this.addShapeMatter, "frictionStatic", 0, 10, 0.05);
    guiAddShapeMatter.add(this.addShapeMatter, "frictionAir", 0, 0.1, 0.01);
    guiAddShapeMatter.add(this.addShapeMatter, "restitution", 0, 1, 0.05);
    guiAddShapeMatter.add(this.addShapeMatter, "chamfer", 0, 30, 1);
  }

  setupAddShapePixiFields() {
    const guiAddShapePixi = this.guiAddShapePixi;
    guiAddShapePixi.addColor(this.addShapePixi, "fillColor");
    guiAddShapePixi.add(this.addShapePixi, "fillAlpha", 0, 1, 0.05);
    guiAddShapePixi.addColor(this.addShapePixi, "lineColor");
    guiAddShapePixi.add(this.addShapePixi, "lineAlpha", 0, 1, 0.05);
    guiAddShapePixi.add(this.addShapePixi, "lineWidth", 0, 10, 1);
  }

  // [World];
  initWorld() {
    this.initWorldConfig();
    this.initWorldGravityConfig();
    // this.initWorldEngineConfig();
    this.setupWorldFields();
  }

  initWorldConfig() {
    this.world = {
      shuffle: () => {
        console.log("suffle");
      },
      clear: () => {
        console.log("clear");
      }
    };
  }

  initWorldGravityConfig() {
    this.worldGravity = {
      scale: .001, // 0 -
      x: 0, // -1 - 1
      y: 1, // same
    };
  }

  // [Engine]
  // What do these do? do I need them?
  // enableSleeping (?)
  // timeScale
  // velocityIterations
  // positionIterations
  // constraintIterations
  // enabled (?)
  // initWorldEngineConfig() {
  //   this.worldEngine = {
  //     enableSleeping: false,
  //     timeScale: 1, 
  //     scale: 0.001, // 0 -
  //     x: 0, // -1 - 1
  //     y: 1, // same
  //   };
  // }

  setupWorldFields() {
    const guiWorld = this.guiWorld;


    this.setupWorldGravityConfig();

    // *shuffle*
    guiWorld.add(this.world, "shuffle");
    // *clear*
    guiWorld.add(this.world, "clear");
  }

  setupWorldGravityConfig() {
    const guiWorldGravity = this.guiWorldGravity;
    guiWorldGravity.add(this.worldGravity, "scale", 0, .001, 0.0001);
    guiWorldGravity.add(this.worldGravity, "x", -1, 1, 0.1);
    guiWorldGravity.add(this.worldGravity, "y", -1, 1, 0.1);
  }
}
