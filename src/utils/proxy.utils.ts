import { isDrawingFn } from './context.utils.js';
import { Context2DHistory } from './history.utils.js';

export type Context2D =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

export type Context2DCtor = new () => Context2D;

export type ProxyOptions = {
  onDraw: (context: Context2D, drawFn: string, args?: unknown[]) => void;
};

function applyProxyTo(
  objectCtor: typeof HTMLCanvasElement | typeof OffscreenCanvas,
  contextCtor: Context2DCtor,
  { onDraw }: Partial<ProxyOptions>,
) {
  // create a mirror of the 2d context
  const mirror = {
    __cloned: false,
    __withoutSideEffects: {},
  } as unknown as typeof contextCtor;

  // copy all properties from the original context
  const properties = Object.getOwnPropertyDescriptors(contextCtor.prototype);
  Object.defineProperties(mirror, properties);
  Object.keys(properties).forEach(prop => {
    delete contextCtor.prototype[prop];
  });

  // prepare history on canvas
  Object.defineProperty(objectCtor.prototype, '__history', {
    get(): Context2DHistory {
      if (!this.___history) {
        this.___history = new Context2DHistory();
      }
      return this.___history;
    },
    set(value: Context2DHistory) {
      this.___history = value;
    },
  });

  Object.setPrototypeOf(
    contextCtor.prototype,
    new Proxy<Context2DCtor>(mirror, {
      get(target, prop: keyof Context2D, receiver: Context2D) {
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
              receiver.canvas.__history.add({ type: 'draw', prop, args });
              return;
            }

            receiver.canvas.__history.add({ type: 'apply', prop, args });
            // @ts-expect-error - it's a function, we checked!
            return target[prop].apply(receiver, args);
          };
        }

        // handle property access: a.b
        return Reflect.get(target, prop, receiver);
      },
      set(
        target: Context2DCtor,
        prop: keyof Context2DCtor,
        value: unknown,
        receiver: Context2D,
      ) {
        // update history
        receiver.canvas.__history.add({ type: 'set', prop, value });

        // skip eventually native implementation;
        // else the filter will be applied twice
        if (prop === 'filter') return true;

        // handle property set: a.b = value
        return Reflect.set(target, prop, value, receiver);
      },
    }),
  );
}

export function applyProxy(options: Partial<ProxyOptions> = {}) {
  applyProxyTo(HTMLCanvasElement, CanvasRenderingContext2D, options);
  applyProxyTo(OffscreenCanvas, OffscreenCanvasRenderingContext2D, options);
}
