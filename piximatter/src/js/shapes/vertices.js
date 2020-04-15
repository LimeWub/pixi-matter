function Shape_element(options) {
  options = {
    type: app.shapes_keys[Math.floor(Math.random() * app.shapes_keys.length)],
    scale: 1 + Math.random(),
    rotation: radianCircle * Math.random(),
    graphic_settings: {},
    position: {
      x: Math.floor(Math.random() * app.renderer.screen.width),
      y: Math.floor(Math.random() * app.renderer.screen.height)
    },
    ...options
  };
  //tmp
  //  options.scale = .5;

  const shape = app.shapes[options.type];
  const body = Matter.Bodies.fromVertices(
    options.position.x,
    options.position.y,
    shape,
    {
      friction: 1
      //    restitution: .5
    }
  );

  //More flexible but less performant (?)
  const graphic = new PIXI.Graphics();
  applyStyles(graphic, options.graphic_settings);
  graphic.moveTo(shape[0].x, shape[0].y);
  for (let i = 1; i < shape.length; i++) {
    graphic.lineTo(shape[i].x, shape[i].y);
  }
  graphic.closePath();

  //Body
  Matter.World.add(engine.world, body);
  //  Matter.Body.scale(body, options.scale, options.scale);

  //Graphic
  graphic.body = body; //ez access
  graphic.pivotAnchor = new PIXI.Point(0.5, 0.5);
  adjustSize(graphic);

  // Now do rotation:
  Matter.Body.rotate(body, options.rotation);

  adjustRotation(graphic);
  adjustPosition(graphic);

  graphic.onTick = function(delta) {
    // Delta? What do?
    if (graphic.body.isStatic) return;

    adjustRotation(graphic);
    adjustPosition(graphic);

    if (isOutsideOfCanvas(graphic)) {
      graphic.parent.removeChild(graphic);
      Matter.World.remove(engine.world, graphic.body);
    }
  };

  return graphic;
}
