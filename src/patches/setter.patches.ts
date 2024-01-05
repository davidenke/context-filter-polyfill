import { PROTECTED_KEYS } from '../globals/protected-keys.global';
import { createOffscreenContext } from '../utils/context.utils';

export function applySetterPatches(context: new () => CanvasRenderingContext2D) {
  // we monkey-patch all context members to
  // apply everything to the current mirror
  Object.keys(context.prototype)
    // do not overload these
    .filter(member => PROTECTED_KEYS.indexOf(member) < 0)
    // get the whole descriptor
    .map(
      member =>
        ({
          member,
          descriptor: Object.getOwnPropertyDescriptor(context.prototype, member),
        }) as {
          member: keyof CanvasRenderingContext2D;
          descriptor: PropertyDescriptor | undefined;
        },
    )
    // get setters only
    // .filter(({ descriptor }) => descriptor!.set)
    // apply monkey-patch to pass through
    .forEach(({ member, descriptor }) => {
      const original = descriptor;

      // handle getter-only properties
      // if (!!descriptor!.set) {
      //   console.log(member, typeof descriptor?.[member as never])
      //   return;
      // }

      // overload setter
      Object.defineProperty(context.prototype, member, {
        get: function () {
          if (this.canvas.__skipFilterPatch) {
            return original!.get!.call(this);
          }

          // read from mirror
          return this.canvas.__currentPathMirror[member];
        },
        set: function (value: unknown) {
          // do not apply on mirror
          if (this.canvas.__skipFilterPatch) {
            return original!.set!.call(this, value);
          }

          // prepare mirror context if missing
          if (!this.canvas.__currentPathMirror) {
            this.canvas.__currentPathMirror = createOffscreenContext();
          }

          // apply to mirror
          this.canvas.__currentPathMirror[member] = value;
        },
      });
    });
}
