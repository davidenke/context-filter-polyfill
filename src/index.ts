import { AvailableFilter } from './enums/available-filter.enum';

import { DRAWING_FUNCTIONS } from './globals/drawing-functions.global';
import { SUPPORTED_FILTERS } from './globals/supported-filters.global';

import { supportsContextFilters } from './utils/context.utils';
import { applyFilter } from './utils/filter.utils';

import { none } from './filters/none.filter';
import { invert } from './filters/invert.filter';
import { opacity } from './filters/opacity.filter';

// add supported filters here by mapping the available
// filter to the imported, implemented function
SUPPORTED_FILTERS.set(AvailableFilter.None, none);
SUPPORTED_FILTERS.set(AvailableFilter.Invert, invert);
SUPPORTED_FILTERS.set(AvailableFilter.Opacity, opacity);

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
      applyFilter(this, this['__filter']);
    };
  });
  CanvasRenderingContext2D.prototype;
}
