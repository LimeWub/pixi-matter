import { PixiMatter } from "../piximatter/src/js/piximatter.js";
import { PixiMatterGui } from "../piximatter_playground_utils/src/js/datgui/datgui.js";
import data from "../data/test.json";

console.log("hello world");
const pm = new PixiMatter({
  element: document.getElementById("piximatter-placeholder-1"),
  debug: true,
  data,
  walls: true,
});
new PixiMatterGui({ PixiMatterObject: pm });
