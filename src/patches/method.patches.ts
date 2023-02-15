import { createOffscreenContext } from '../utils/context.utils';
import { DRAWING_FUNCTIONS } from '../globals/drawing-functions.global';
import { PROTECTED_KEYS } from '../globals/protected-keys.global';
import { applyFilter } from '../utils/filter.utils';

export function applyMethodPatches(context: any) {
  // we monkey-patch all context members to
  // apply everything to the current mirror
  Object.keys(context.prototype)
    // do not overload these
    .filter(member => PROTECTED_KEYS.indexOf(member) < 0)
    // get the whole descriptor
    .map(member => ({
      member,
      descriptor: Object.getOwnPropertyDescriptor(context.prototype, member),
    }))
    // get methods only
    .filter(({ descriptor }) => descriptor!.value && typeof descriptor!.value === 'function')
    // apply monkey-patch to pass through
    .forEach(({ member, descriptor }) => {
      const original = descriptor!.value;
      Object.defineProperty(context.prototype, member, {
        value: function (...args: any[]) {
          // do not apply on mirror, but apply clearRect to original
          if (this.canvas.__skipFilterPatch || member === 'clearRect') {
            return original.call(this, ...args);
          }

          // prepare mirror context if missing
          if (!this.canvas.__currentPathMirror) {
            this.canvas.__currentPathMirror = createOffscreenContext(this);
          }

          // apply to mirror
          const result = this.canvas.__currentPathMirror[member](...args);

          // draw functions may get filters applied and copied back to original
          if (DRAWING_FUNCTIONS.indexOf(member) > -1) {
            // apply the filter
            applyFilter(this.canvas.__currentPathMirror, this.filter);

            // disable patch and reset transform temporary if supported
            this.canvas.__skipFilterPatch = true;
            let originalTransform;
            if ('getTransform' in this) {
              originalTransform = this.getTransform();
              this.setTransform(1, 0, 0, 1, 0, 0);
            }

            // draw mirror back
            this.drawImage(this.canvas.__currentPathMirror.canvas, 0, 0);

            // set back transforms and re-enable patch
            if (originalTransform) {
              this.setTransform(originalTransform);
            }
            this.canvas.__skipFilterPatch = false;

            // reset the mirror for next draw cycle
            this.canvas.__currentPathMirror = createOffscreenContext(this);
          }

          return result;
        },
      });
    });
}
