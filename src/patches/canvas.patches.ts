export function applyCanvasPatches(canvas: new () => HTMLCanvasElement) {
  // we monkey-patch all context members to
  // apply everything to the current mirror
  Object.keys(canvas.prototype)
    // get the whole descriptor
    .map(
      member =>
        ({
          member,
          descriptor: Object.getOwnPropertyDescriptor(canvas.prototype, member),
        }) as {
          member: keyof HTMLCanvasElement;
          descriptor: PropertyDescriptor | undefined;
        },
    )
    // get properties only
    .filter(({ descriptor }) => !descriptor!.value)
    // only properties that are not read-only
    .filter(({ descriptor }) => descriptor!.configurable)
    // apply monkey-patch to pass through
    .forEach(({ member, descriptor }) => {
      const original = descriptor;

      // overload setter
      Object.defineProperty(canvas.prototype, member, {
        get: function (this: HTMLCanvasElement) {
          // read from original
          if (this.__skipFilterPatch || !this.__currentPathMirror) {
            return original!.get!.call(this);
          }

          // read from mirror
          return this.__currentPathMirror.canvas[member];
        },
        set: function (this: HTMLCanvasElement, value: unknown) {
          // set on original
          original!.set!.call(this, value);

          // apply on mirror
          if (!this.__skipFilterPatch && this.__currentPathMirror) {
            // cast to any, as read-only properties are not assignable, but filtered
            (this.__currentPathMirror.canvas as any)[member] = value;
          }
        },
      });
    });
}
