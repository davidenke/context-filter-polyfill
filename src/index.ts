import { AvailableFilter } from './enums/available-filter.enum';

import { DRAWING_FUNCTIONS } from './globals/drawing-functions.global';
import { PROTECTED_KEYS } from './globals/protected-keys.global';
import { SUPPORTED_FILTERS } from './globals/supported-filters.global';

import { createOffscreenContext, supportsContextFilters } from './utils/context.utils';
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
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'filter', { value: AvailableFilter.None });

  // we use a separate offscreen canvas to mirror the draw of the current
  // path which is reset after every draw but must be initialized first
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (contextId: string, contextAttributes?: {}, doNotPatch = false) {
    // call original constructor
    const context = original.call(this, contextId, contextAttributes);

    // create the mirror
    if (!doNotPatch) {
      Object.defineProperties(context, {
        __filterPatched: { writable: false, value: true },
        __currentPathMirror: { writable: true, value: createOffscreenContext(context) }
      });
    }

    return context;
  };

  // we monkey-patch all context members to
  // apply everything to the current mirror
  const descriptors = Object.getOwnPropertyDescriptors(CanvasRenderingContext2D.prototype);
  Object
    .keys(descriptors)
    // do not overload these
    .filter(member => !PROTECTED_KEYS.includes(member))
    .forEach(member => {
      const descriptor = descriptors[member];

      // overload setter
      if (descriptor.set) {
        const original = descriptor.set;
        Object.defineProperty(CanvasRenderingContext2D.prototype, member, {
          ...descriptor,
          set: function(value: any) {
            // call original implementation
            original.call(this, value);

            // do we have a mirror?
            if (this.__filterPatched) {
              // apply to mirror
              this.__currentPathMirror[member] = value;
            }
          }
        });
      }
      // monkey-patch method
      else if (descriptor.value && typeof descriptor.value === 'function') {
        const original = descriptor.value;
        Object.defineProperty(CanvasRenderingContext2D.prototype, member, {
          value: function (...args) {
            // call original drawing function
            original.apply(this, args);

            // do we have a mirror?
            if (this.__filterPatched) {
              // apply to mirror
              this.__currentPathMirror[member].apply(this, args);

              if (DRAWING_FUNCTIONS.includes(member)) {
                // draw, apply and then reset current path mirror
                applyFilter(this.__currentPathMirror, this.__filter);
              }
            }
          }
        });
      }
    });
}
