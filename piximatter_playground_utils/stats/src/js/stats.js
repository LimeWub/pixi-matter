import { default as stats } from "stats.js";
import "../scss/styles.scss";

export class PixiMatterStats {
  constructor({ PixiMatterObject: pmo }) {
    this._pmo = pmo;
    this.init();
  }

  init() {
    this.stats = new stats();
    this.stats.dom.classList.add("piximatter-stats");
    this._pmo._dom.element.appendChild(this.stats.dom);
    this._pmo.stats = this.stats;
  }
}
