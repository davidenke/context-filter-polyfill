import { PROTECTED_KEYS } from '../globals/protected-keys.global';
import { createOffscreenContext } from '../utils/context.utils';

export function applySetterPatches() {
  // we monkey-patch all context members to
  // apply everything to the current mirror
  const descriptors = Object.getOwnPropertyDescriptors(CanvasRenderingContext2D.prototype);
  Object
    .keys(descriptors)
    // do not overload these
    .filter(member => !PROTECTED_KEYS.includes(member))
    // get setters only
    .filter(member => descriptors[member].set)
    // apply monkey-patch to pass through
    .forEach(member => {
      const descriptor = descriptors[member];

      // overload setter
      const original = descriptor;
      Object.defineProperty(CanvasRenderingContext2D.prototype, member, {
        get: function () {
          if (this.canvas.__skipFilterPatch) {
            return original.get.call(this);
          }

          // read from mirror
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
    });
}
