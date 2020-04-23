import * as Matter from "matter-js";
import * as PIXI from "pixi.js";
import { Circle } from "./shapes/circle.js";
import { Rectangle } from "./shapes/rectangle.js";
import { Polygon } from "./shapes/polygon.js";
import { Vertices } from "./shapes/vertices.js";
import { Trapezoid } from "./shapes/trapezoid.js";
import { getWallsData } from "./_util/getWallsData.js";
// var pathseg = require('pathseg'); // I think Matter needs this?

import "../scss/styles.scss";

export const PixiMatter = function ({
  element,
  pixi_config = {},
  matter_config = {},
  debug = false,
  walls = false,
  loopAround = false,
  data,
  copy = {
    init: "Initializing",
    resize: "Resizing",
  },
}) {
  const BLOCK_ELEMENT_CLASSNAME = "piximatter";

  this._element = {
    boundingClientRect: element.getBoundingClientRect(),
  };

  this._dom = {};
  this._pixi = { app: {} };
  this._bodies = [];
  this._matter = { engine: {}, renderer: {} };

  this.init = () => {
    const dom = this._dom;

    try {
      this.initDOM();
      this.initPixi();
      this.initMatter();
      this.setBodies({ data });
      this.initTicker();
      this.initEvents();

      this.doSize();

      console.log(
        "%cLOADED ◀",
        "color: white;" +
          "background: #02d675;" +
          "margin: 5px;" +
          "padding: 5px;"
      );
      dom.message.style.display = "none";
    } catch (error) {
      console.log(
        "%cFAILED ◀",
        "color: white;" +
          "background: #d60249;" +
          "margin: 5px;" +
          "padding: 5px;"
      );
      console.error(error);
    }

    return this;
  };

  this.initDOM = () => {
    element.classList.add(BLOCK_ELEMENT_CLASSNAME);
    this._dom.element = element;

    const message = document.createElement("div");
    message.classList.add(`${BLOCK_ELEMENT_CLASSNAME}__message`);
    var t = document.createTextNode(copy.init);
    message.appendChild(t);
    element.appendChild(message);
    this._dom.message = message;

    const pixi = document.createElement("canvas");
    pixi.classList.add(
      `${BLOCK_ELEMENT_CLASSNAME}__canvas`,
      `${BLOCK_ELEMENT_CLASSNAME}__canvas--pixi`
    );
    element.appendChild(pixi);
    this._dom.pixi = pixi;

    const matter = document.createElement("canvas");
    matter.classList.add(
      `${BLOCK_ELEMENT_CLASSNAME}__canvas`,
      `${BLOCK_ELEMENT_CLASSNAME}__canvas--matter`
    );
    element.appendChild(matter);
    this._dom.matter = matter;
  };

  this.initPixi = () => {
    PIXI.settings.ROUND_PIXELS = true;
    const app = new PIXI.Application({
      view: this._dom.pixi,
      autoResize: true,
      antialias: true,
      resolution: 2,
      transparent: true,
      ...pixi_config,
    });

    app.stage = new PIXI.Container();
    app.renderer.render(app.stage);

    this._pixi.app = app;
  };

  this.initMatter = () => {
    const bcr = this._element.boundingClientRect;

    const engine = Matter.Engine.create();
    this._matter.engine = engine;
    this.doMatterGravity({ gravityConfig: matter_config.gravity });

    const renderer = Matter.Render.create({
      canvas: this._dom.matter,
      engine: engine,
      options: {
        width: bcr.width,
        height: bcr.height,
        wireframes: true,
        showVelocity: true,
        showCollisions: true,
        showAngleIndicator: true,
        background: "transparent",
        wireframeBackground: "transparent",
      },
    });
    this._matter.renderer = renderer;
    Matter.Render.run(renderer);

    // add mouse control
    const mouse = Matter.Mouse.create(renderer.canvas),
      mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.01,
          render: {
            visible: true,
          },
        },
      });
    Matter.World.add(engine.world, mouseConstraint);
    // keep the mouse in sync with rendering
    renderer.mouse = mouse;
  };

  this.doMatterGravity = ({ gravityConfig }) => {
    const engine = this._matter.engine;
    engine.world.gravity = { ...engine.world.gravity, ...gravityConfig };
  };

  this.randomizeBodiesPosition = () => {
    const bodies = this._bodies;
    const renderer = this._matter.renderer;

    bodies.forEach((b) => {
      b.shape.randomizePosition(renderer.bounds);
    });
  };

  this.addBody = ({ data, pixiParentContainer: pc }) => {
    const app = this._pixi.app;
    const engine = this._matter.engine;
    data.config.pixi_config.parentContainer = pc || app.stage; // ._.
    data.config.matter_config.parentContainer = engine.world; // ._.
    let b;
    for (let i = 0; i < (data.amount || 1); i++) {
      switch (data.type) {
        case "circle":
          b = new Circle({ config: data.config });
          break;
        case "rectangle":
          b = new Rectangle({ config: data.config });
          break;
        case "trapezoid":
          b = new Trapezoid({ config: data.config });
          break;
        case "polygon":
          b = new Polygon({ config: data.config });
          break;
        case "vertices":
          b = new Vertices({ config: data.config });
          break;
        default:
          console.log("SAD");
          return;
      }

      if (!(b && b._matter.isInitialised && b._pixi.isInitialised)) return;

      this._bodies = [
        ...this._bodies,
        { id: data.id, type: data.type, tags: data.tags || [], shape: b },
      ];
    }
  };

  this.addBodies = ({ data, pixiParentContainer: pc }) => {
    const app = this._pixi.app;
    const pixiParentContainer = pc || app.stage; // (!): No child containers MOFO (can bundle at 'stageContent' level otherwise f'off)

    data.forEach((d) => {
      this.addBody({ data: d, pixiParentContainer });
    });
  };

  this.deleteBody = ({ iteratee }) => {
    this.deleteBodies({ iteratee, greedy: false });
  };

  this.deleteBodies = ({ iteratee, greedy = true }) => {
    const bodies = this._bodies;
    let matchCount = 0;

    const deleter = (bodies, iteratee) => {
      const newBodies = [];
      bodies.forEach((b) => {
        // Greed check
        if (!greedy && matchCount > 1) {
          newBodies.push(b);
          return;
        }

        // BAU
        const isMatch = iteratee(b);
        if (isMatch) matchCount++;

        // Does the current body match the filter?
        if (isMatch) {
          const shape = b.shape;
          // Goodbye cruel world.
          shape.clear();
        } else {
          // Shantay you stay
          newBodies.push(b);
        }
      });
      return newBodies;
    };

    this._bodies = deleter(bodies, iteratee);
  };

  this.setBodies = ({ data }) => {
    this.deleteBodies({ iteratee: () => true }); // Trash 'em all
    this.addBodies({ data });
  };

  this.exportJSON = () => {
    // @TODO: export entire configuration. inc bodies (position, rotation etc), world, pixi etc
  };

  this.toggleDebug = (force) => {
    const renderer = this._matter.renderer;
    this._debug = typeof force !== "undefined" ? !!force : !this._debug;
    renderer.canvas.style.opacity = this._debug ? 1 : 0;
  };

  this.doFPS = (fps = 60) => {
    const app = this._pixi.app;
    app.ticker.maxFPS = fps;
  };

  this.initTicker = () => {
    const app = this._pixi.app;
    const engine = this._matter.engine;
    const renderer = this._matter.renderer;

    const onTick = (delta) => {
      if (this.isResizing) return; // Don't do anything if resizing.

      Matter.Engine.update(engine, delta);

      const ticker = (bodies) => {
        bodies.forEach((b) => {
          const shape = b.shape;
          shape.fromMatterToPixi();
          if (!shape.isInBounds(renderer.bounds)) {
            this.deleteBody({ iteratee: (body) => body.id === b.id });
          }
        });
      };

      ticker(this._bodies);
    };

    app.ticker.add((delta) => {
      if (app.ticker.maxFPS === 0) return; // Freeze.
      if (this.stats) this.stats.begin();
      onTick(delta);
      if (this.stats) this.stats.end();
    });
    this.doFPS();

    app.ticker.start();
  };

  this.initEvents = () => {
    window.addEventListener("resize", onResize, { passive: true });
  };

  this.doSize = () => {
    const app = this._pixi.app;
    const renderer = this._matter.renderer;
    const bcr = element.getBoundingClientRect();
    this._element.bcr = bcr; // update bcr

    this.deleteBodies({ iteratee: (b) => b.tags.includes("walls") });
    if (walls) {
      this.addBodies({ data: getWallsData(bcr) });
    }

    //Resize renderer
    // Pixi
    app.renderer.resize(bcr.width, bcr.height);
    // Matter
    renderer.canvas.width = bcr.width;
    renderer.canvas.height = bcr.height;

    //Then loop through all the stage children
    let stageChildren = app.stage.children;
    for (let i = 0; i < stageChildren.length; i++) {
      //If they have a resize function then
      // trigger that
      if (
        stageChildren[i].resize &&
        typeof stageChildren[i].resize === "function"
      ) {
        stageChildren[i].resize();
      }
    }
  };

  let debouncedResize;
  const onResize = () => {
    this.isResizing = true;
    const message = this._dom.message;

    //Show 'Resizing' overlay so we can take
    // advantage of debouncing.
    message.textContent = copy.resize;
    message.style.display = "";

    // Debounce resize event so it
    // is only acted once; meaning the
    // app is more performant and wont try
    // to redraw a billion times on resize.
    clearTimeout(debouncedResize);
    debouncedResize = setTimeout(() => {
      this.doSize();
      this.isResizing = false;
      message.style.display = "none";
    }, 250);
  };

  return this.init();
};

// function initShapesSelection() {
//   function getShapeVertices(pathElement) {
//     return Matter.Svg.pathToVertices(pathElement, 1);
//   }

//   const shapesSelection = document.getElementById('shapes-selection');
//   const availablePaths = shapesSelection.querySelectorAll('path[id]');
//   for (let i = 0; i < availablePaths.length; i++) {
//     app.shapes[availablePaths[i].id] = getShapeVertices(availablePaths[i]);
//     app.shapes_keys.push(availablePaths[i].id);
//   }
// }

// particles/group
//
// initParticles({
//   shapes_count: 5,
//   rectangles_count: 5,
//   circles_count: 5,
//   dot_count: 5
// });
