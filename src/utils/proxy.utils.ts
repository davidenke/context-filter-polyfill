// 1. proxy everything from 2d context into a mirror
// 2. on every draw function, replicate into a canvas copy
// 3. apply latest filter to current copy

declare global {
  type CanvasRenderingContext2DHistoryEntry = {
    type: 'set' | 'apply' | 'draw';
    prop: string | symbol;
    value?: unknown;
    args?: unknown[];
  };
  type CanvasRenderingContext2DHistory = CanvasRenderingContext2DHistoryEntry[];
  interface CanvasRenderingContext2D {
    __cloned: boolean;
    __skipNextDraw: boolean;
  }

  interface HTMLCanvasElement {
    __history: CanvasRenderingContext2DHistory;
  }
}

// a list of all drawing functions in CanvasRenderingContext2D
const DRAWING_FN_PROPS: Array<keyof CanvasRenderingContext2D> = [
  'clearRect',
  'clip',
  'drawImage',
  'putImageData',
  'fill',
  'fillRect',
  'fillText',
  'stroke',
  'strokeRect',
  'strokeText',
  'reset',
  'restore',
];

export function addHistoryEntry(
  context: CanvasRenderingContext2D,
  entry: CanvasRenderingContext2DHistoryEntry,
) {
  if (!context.canvas.__history) context.canvas.__history = [];
  context.canvas.__history.push(entry);
}

export function applyProxy(
  onDraw: (
    context: CanvasRenderingContext2D,
    drawFn: string,
    args?: unknown[],
  ) => void,
) {
  const mirror = {
    __cloned: false,
    __clearRect(
      this: CanvasRenderingContext2D,
      ...args: Parameters<CanvasRenderingContext2D['clearRect']>
    ) {
      this.__skipNextDraw = true;
      this.clearRect(...args);
      this.__skipNextDraw = false;
    },
    __drawImage(
      this: CanvasRenderingContext2D,
      ...args: Parameters<CanvasRenderingContext2D['drawImage']>
    ) {
      this.__skipNextDraw = true;
      this.drawImage(...args);
      this.__skipNextDraw = false;
    },
  } as unknown as CanvasRenderingContext2D;

  // create a mirror of the 2d context
  const properties = Object.getOwnPropertyDescriptors(
    CanvasRenderingContext2D.prototype,
  );
  Object.defineProperties(mirror, properties);
  Object.keys(properties).forEach(property => {
    // @ts-expect-error - we're doing nasty things here
    delete CanvasRenderingContext2D.prototype[property];
  });

  Object.setPrototypeOf(
    CanvasRenderingContext2D.prototype,
    new Proxy<CanvasRenderingContext2D>(mirror, {
      get(
        target,
        prop: keyof CanvasRenderingContext2D,
        receiver: CanvasRenderingContext2D,
      ) {
        // handle function calls: a.b(...args)
        if (prop in properties && 'value' in properties[prop as string]) {
          // use the default implementation if needed
          if (receiver.__skipNextDraw) {
            receiver.__skipNextDraw = false;
            return Reflect.get(target, prop, receiver);
          }

          // provide a wrapper function to intercept arguments
          return (...args: unknown[]) => {
            // skip drawing functions, apply our own magic
            if (DRAWING_FN_PROPS.includes(prop)) {
              onDraw(receiver, prop, args);
              addHistoryEntry(receiver, { type: 'draw', prop, args });
              return;
            }

            addHistoryEntry(receiver, { type: 'apply', prop, args });
            // @ts-expect-error - it's a function, we checked!
            return target[prop].apply(receiver, args);
          };
        }

        // handle property access: a.b
        return Reflect.get(target, prop, receiver);
      },
      set(
        target: CanvasRenderingContext2D,
        prop: keyof CanvasRenderingContext2D,
        value: unknown,
        receiver: CanvasRenderingContext2D,
      ) {
        // update history
        addHistoryEntry(receiver, { type: 'set', prop, value });

        // skip eventually native implementation;
        // else the filter will be applied twice
        if (prop === 'filter') return false;

        // handle property set: a.b = value
        return Reflect.set(target, prop, value, receiver);
      },
    }),
  );
}
