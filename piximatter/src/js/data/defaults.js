// Matter
export const matter_engine_default_config = {};
export const matter_mouse_default_config = {
  constraint: {
    stiffness: 0.2,
    render: {
      visible: true
    }
  }
};
export const matter_body_default_config = {};
// Pixi
export const pixi_renderer_default_config = {
  autoResize: true,
  antialias: true,
  resolution: 2,
  transparent: true
};
export const pixi_graphic_default_config = {};
// Util
export const getRandomPoint = (xRange, yRange) => {
  return {
    x: xRange.min + Math.round(Math.random() * (xRange.max - xRange.min)),
    y: yRange.min + Math.round(Math.random() * (yRange.max - yRange.min))
  };
};
