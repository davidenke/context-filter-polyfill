import { AvailableFilter } from './enums/available-filter.enum';
import { Filter } from './types/filter.type';

import { none } from './filters/none.filter';
import { opacity } from './filters/opacity.filter';

const SUPPORTED_FILTERS = new Map<string, Filter>();
SUPPORTED_FILTERS.set(AvailableFilter.None, none);
SUPPORTED_FILTERS.set(AvailableFilter.Opacity, opacity);

const DRAWING_FUNCTIONS = [
  'arc',
  'arcTo',
  'bezierCurveTo',
  'clearRect',
  'clip',
  'closePath',
  'createPattern',
  'drawImage',
  'fill',
  'fillRect',
  'fillText',
  'lineTo',
  'quadraticCurveTo',
  'rect',
  'stroke',
  'strokeRect',
  'strokeText'
];

// feature detection
const supportsContextFilters = () => 'filter' in CanvasRenderingContext2D.prototype;

// filter application
const applyFilter = (context: CanvasRenderingContext2D, canvasFilters: CanvasFilters['filter']) => {
  // read current canvas content
  // TODO: we need the current path only instead
  const input = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

  // parse applied filters and call implementations
  const filtered = canvasFilters
    // filters are separated by whitespace
    .split(' ')
    // filters may have options within appended brackets
    .map(filter => filter.match(/(\w+)\((.*)\)/si).slice(1, 3) as [AvailableFilter, string])
    // apply all filters
    .reduce((raw, [filter, options]) => {
      // do we have a appropriate filter implementation?
      if (SUPPORTED_FILTERS.has(filter)) {
        // then filter and return the result
        return SUPPORTED_FILTERS.get(filter)(raw, options);
      }
      // nope, so skip this
      return raw;
    }, input);

  // set back the filtered image data
  context.putImageData(filtered, 0, 0);
};

// polyfill if the feature is not implemented
if (!supportsContextFilters()) {
  // add filter property
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'filter', {
    get: function () {
      // deliver stored filter
      return this['__filter'];
    },
    set: function (filter: CanvasFilters['filter']) {
      // store filter
      this['__filter'] = filter;
    }
  });

  // monkey-patch drawing functions
  DRAWING_FUNCTIONS.forEach(name => {
    const original = CanvasRenderingContext2D.prototype[name];
    CanvasRenderingContext2D.prototype[name] = function (...args) {
      // call original drawing function
      original.apply(this, args);

      // apply filter
      applyFilter(this, this.filter);
    };
  });
  CanvasRenderingContext2D.prototype;
}
