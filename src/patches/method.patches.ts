import { createOffscreenContext } from '../utils/context.utils';
import { DRAWING_FUNCTIONS } from '../globals/drawing-functions.global';
import { PROTECTED_KEYS } from '../globals/protected-keys.global';
import { applyFilter } from '../utils/filter.utils';

export function applyMethodPatches() {
  // we monkey-patch all context members to
  // apply everything to the current mirror
  const descriptors = Object.getOwnPropertyDescriptors(CanvasRenderingContext2D.prototype);
  Object
    .keys(descriptors)
    // do not overload these
    .filter(member => !PROTECTED_KEYS.includes(member))
    // get methods only
    .filter(member => descriptors[member].value && typeof descriptors[member].value === 'function')
    // apply monkey-patch to pass through
    .forEach(member => {
      const descriptor = descriptors[member];
      if (descriptor.value && typeof descriptor.value === 'function') {
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
            this.canvas.__currentPathMirror.shadowBlur = 5;
            this.canvas.__currentPathMirror.shadowColor = 'red';
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
