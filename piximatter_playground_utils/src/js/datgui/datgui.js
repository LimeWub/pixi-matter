import * as dat from "dat.gui";
// Christ
// https://workshop.chromeexperiments.com/examples/guiVR/#1--Basic-Usage
// https://codepen.io/supah/pen/prVVOx?editors=0010

// SVG?: https://stackoverflow.com/questions/23417991/load-a-file-using-a-dat-gui-button

// https://github.com/dataarts/dat.gui/blob/master/API.md

// dat boi needs the f l a t
const settings = [
{name: "bg", type: "lines"}
];

export class Settings {
  constructor() {
    this.init();
  }

  init() {}
}

function datgui() {
  const gui = new dat.GUI();

  // Settings
  let guiSettings = gui.addFolder("Settings");
  guiSettings
    .add(settings, "lines", 5, 50)
    .step(1)
    .onChange(init);
  guiSettings
    .add(settings, "smoothness", 0.5, 10)
    .step(0.2)
    .onChange(init);
  guiSettings.add(settings, "fill", false).onChange(init);
  guiSettings.open();

  // Start Color
  let guiStartColor = gui.addFolder("Start Color");
  guiStartColor
    .add(settings, "hueStartColor", 0, 360)
    .step(1)
    .onChange(init);
  guiStartColor.open();

  // End Color
  let guiEndColor = gui.addFolder("End Color");
  guiEndColor
    .add(settings, "hueEndColor", 0, 360)
    .step(1)
    .onChange(init);
  guiEndColor
    .add(settings, "saturationEndColor", 0, 100)
    .step(1)
    .onChange(init);
  guiEndColor
    .add(settings, "lightnessEndColor", 0, 100)
    .step(1)
    .onChange(init);
  guiEndColor.open();

  // Randomize
  let guiRandomize = {
    randomize: function() {
      randomize();
    }
  };
  gui.add(guiRandomize, "randomize");

  return gui;
}

datgui();
