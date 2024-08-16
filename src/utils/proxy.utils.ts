import { addHistoryEntry, isDrawingFn } from './context.utils.js';
import type { CanvasRenderingContext2DHistory } from './history.utils.js';

export type ProxyOptions = {
  onHistoryUpdate: (history: CanvasRenderingContext2DHistory) => void;
  onDraw: (
    context: CanvasRenderingContext2D,
    drawFn: string,
    args?: unknown[],
  ) => void;
};

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
      get(
        target,
        prop: keyof CanvasRenderingContext2D,
        receiver: CanvasRenderingContext2D,
      ) {
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

            addHistoryEntry(receiver, { type: 'apply', prop, args }, onHistory);
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
        // @ts-expect-error - TS2589: type instantiation is excessively deep and possibly infinite
        return Reflect.set(target, prop, value, receiver);
      },
    }),
  );
}
