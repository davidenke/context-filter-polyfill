import './filters/blur.filter.js';
import './filters/brightness.filter.js';
import './filters/contrast.filter.js';
import './filters/drop-shadow.filter.js';
import './filters/grayscale.filter.js';
import './filters/hue-rotate.filter.js';
import './filters/invert.filter.js';
import './filters/none.filter.js';
import './filters/opacity.filter.js';
import './filters/saturate.filter.js';
import './filters/sepia.filter.js';

import { applyFilter } from './utils/filter.utils.js';

Object.defineProperty(CanvasRenderingContext2D.prototype, 'filter', {
  set: function (filter: string) {
    this.__filter = filter;
    applyFilter(this, this.__filter);
  },
  get: function () {
    return this.__filter;
  },
  configurable: true,
});
