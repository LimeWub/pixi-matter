import { PixiMatter } from "../piximatter/src/js/piximatter.js";
import data from "../data/test.json";

console.log("hello world");
new PixiMatter({
  element: document.getElementById("piximatter-placeholder-1"),
  debug: true,
  data,
  walls: true
});
