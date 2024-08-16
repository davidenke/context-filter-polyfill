// 1. proxy everything from 2d context into a mirror
// 2. on every draw function, replicate into a canvas copy
// 3. apply latest filter to current copy

import {
  CanvasRenderingContext2DHistory,
  type CanvasRenderingContext2DHistoryEntry,
} from './history.utils.js';

type PickByType<T, Value> = {
  [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
};

declare global {
  type CanvasRenderingContext2DFn = PickByType<
    CanvasRenderingContext2D,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    Function
  >;
  interface CanvasRenderingContext2D {
    __cloned: boolean;
    __withoutSideEffects: CanvasRenderingContext2DFn;
  }

  interface HTMLCanvasElement {
    __history: CanvasRenderingContext2DHistory;
  }
}

// a list of all drawing functions in CanvasRenderingContext2D
const DRAWING_FN_PROPS = [
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
] as const satisfies Partial<Array<keyof CanvasRenderingContext2D>>;

export type ProxyOptions = {
  onHistoryUpdate: (history: CanvasRenderingContext2DHistory) => void;
  onDraw: (
    context: CanvasRenderingContext2D,
    drawFn: string,
    args?: unknown[],
  ) => void;
};

export function isDrawingFn(
  property: string,
): property is (typeof DRAWING_FN_PROPS)[number] {
  return DRAWING_FN_PROPS.includes(
    property as (typeof DRAWING_FN_PROPS)[number],
  );
}

export function addHistoryEntry(
  context: CanvasRenderingContext2D,
  entry: CanvasRenderingContext2DHistoryEntry,
  onUpdate?: ProxyOptions['onHistoryUpdate'],
) {
  if (!context.canvas.__history) {
    context.canvas.__history = new CanvasRenderingContext2DHistory();
  }
  context.canvas.__history.add(entry);
  onUpdate?.(context.canvas.__history);
}

export function applyProxy(options: Partial<ProxyOptions> = {}) {
  // extract options
  const { onDraw, onHistoryUpdate: onHistory } = options;

  // create a mirror of the 2d context
  const mirror = {
    __cloned: false,
    __withoutSideEffects: {},
  } as unknown as CanvasRenderingContext2D;

  // copy all properties from the original context
  const properties = Object.getOwnPropertyDescriptors(
    CanvasRenderingContext2D.prototype,
  );
  Object.defineProperties(mirror, properties);
  Object.keys(properties).forEach(prop => {
    // @ts-expect-error - we're doing nasty things here
    delete CanvasRenderingContext2D.prototype[prop];
  });

  Object.setPrototypeOf(
    CanvasRenderingContext2D.prototype,
    new Proxy<CanvasRenderingContext2D>(mirror, {
      get(target, prop: string, receiver: CanvasRenderingContext2D) {
        // trap access to the __withoutSideEffects property to provide a proxy
        // which exposes all 2d unpatched functions without side effects
        if (prop === '__withoutSideEffects') {
          return new Proxy(
            {},
            {
              get: (_, prop: string) => {
                // @ts-expect-error - our types aren't perfect
                return target[prop].bind(receiver);
              },
            },
          );
        }

        // handle function calls: a.b(...args)
        if (prop in properties && 'value' in properties[prop as string]) {
          // provide a wrapper function to intercept arguments
          return (...args: unknown[]) => {
            // skip drawing functions, apply our own magic
            if (isDrawingFn(prop)) {
              onDraw?.(receiver, prop, args);
              addHistoryEntry(
                receiver,
                { type: 'draw', prop, args },
                onHistory,
              );
              return;
            }

            addHistoryEntry(
              receiver,
              {
                type: 'apply',
                prop: prop as keyof CanvasRenderingContext2D,
                args,
              },
              onHistory,
            );
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
        addHistoryEntry(receiver, { type: 'set', prop, value }, onHistory);

        // skip eventually native implementation;
        // else the filter will be applied twice
        if (prop === 'filter') return true;

        // handle property set: a.b = value
        return Reflect.set(target, prop, value, receiver);
      },
    }),
  );
}
