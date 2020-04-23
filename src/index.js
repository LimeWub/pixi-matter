import { PixiMatter } from "../piximatter/src/js/piximatter.js";
import { PixiMatterGui } from "../piximatter_playground_utils/datgui/src/js/datgui.js";
import { PixiMatterStats } from "../piximatter_playground_utils/stats/src/js/stats.js";
import data from "../data/test.json";

const pm = new PixiMatter({
  element: document.getElementById("piximatter-placeholder-1"),
  debug: true,
  data,
  walls: true,
  matter_config: {
    gravity: {
      scale: 0.1,
      x: 0,
      y: 0.1,
    },
  },
});
new PixiMatterGui({ PixiMatterObject: pm });
new PixiMatterStats({ PixiMatterObject: pm });