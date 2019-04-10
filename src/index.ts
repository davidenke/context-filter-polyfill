import { AvailableFilter } from './enums/available-filter.enum';

import { DRAWING_FUNCTIONS } from './globals/drawing-functions.global';
import { PROTECTED_KEYS } from './globals/protected-keys.global';
import { SUPPORTED_FILTERS } from './globals/supported-filters.global';

import { createOffscreenContext, supportsContextFilters } from './utils/context.utils';
import { applyFilter } from './utils/filter.utils';

import { none } from './filters/none.filter';
import { blur } from './filters/blur.filter';
import { brightness } from './filters/brightness.filter';
import { contrast } from './filters/contrast.filter';
import { grayscale } from './filters/grayscale.filter';
import { invert } from './filters/invert.filter';
import { opacity } from './filters/opacity.filter';

// add supported filters here by mapping the available
// filter to the imported, implemented function
SUPPORTED_FILTERS.set(AvailableFilter.None, none);
SUPPORTED_FILTERS.set(AvailableFilter.Blur, blur);
SUPPORTED_FILTERS.set(AvailableFilter.Brightness, brightness);
SUPPORTED_FILTERS.set(AvailableFilter.Contrast, contrast);
SUPPORTED_FILTERS.set(AvailableFilter.Grayscale, grayscale);
SUPPORTED_FILTERS.set(AvailableFilter.Invert, invert);
SUPPORTED_FILTERS.set(AvailableFilter.Opacity, opacity);

// polyfill if the feature is not implemented
if (!supportsContextFilters()) {
  // add filter property
  Object.defineProperty(HTMLCanvasElement.prototype, '__skipFilterPatch', { writable: true, value: false });
  Object.defineProperty(HTMLCanvasElement.prototype, '__currentPathMirror', { writable: true, value: undefined });
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'filter', { writable: true, value: AvailableFilter.None });

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
        const original = descriptor;
        Object.defineProperty(CanvasRenderingContext2D.prototype, member, {
          get: function () {
            if (this.canvas.__skipFilterPatch) {
              return original.get.call(this);
            }

            return this.canvas.__currentPathMirror[member];
          },
          set: function (value: any) {
            // do not apply on mirror
            if (this.canvas.__skipFilterPatch) {
              return original.set.call(this, value);
            }

            // prepare mirror context if missing
            if (!this.canvas.__currentPathMirror) {
              this.canvas.__currentPathMirror = createOffscreenContext(this);
            }

            // apply to mirror
            this.canvas.__currentPathMirror[member] = value;
          }
        });
      }

      // monkey-patch method
      else if (descriptor.value && typeof descriptor.value === 'function') {
        const original = descriptor.value;
        Object.defineProperty(CanvasRenderingContext2D.prototype, member, {
          value: function (...args) {
            // do not apply on mirror
            if (this.canvas.__skipFilterPatch) {
              return original.call(this, ...args);
            }

            // prepare mirror context if missing
            if (!this.canvas.__currentPathMirror) {
              this.canvas.__currentPathMirror = createOffscreenContext(this);
            }

            // apply to mirror
            const result = this.canvas.__currentPathMirror[member](...args);

            // draw functions may get filters applied and copied back to original
            if (DRAWING_FUNCTIONS.includes(member)) {
              // apply the filter
              applyFilter(this.canvas.__currentPathMirror, this.filter);

              // disable patch and reset transform temporary
              this.canvas.__skipFilterPatch = true;
              const originalTransform = this.getTransform();
              this.setTransform(1, 0, 0, 1, 0, 0);

              // draw mirror back
              this.drawImage(this.canvas.__currentPathMirror.canvas, 0, 0);

              // set back transforms and re-enable patch
              this.setTransform(originalTransform);
              this.canvas.__skipFilterPatch = false;

              // reset the mirror for next draw cycle
              this.canvas.__currentPathMirror = createOffscreenContext(this);
            }

            return result;
          }
        });
      }
    });
}
