import type { Context2DHistory } from './history.utils.js';
import type { Context2D } from './proxy.utils.js';

declare global {
  // some utility types
  type PickByType<T, Value> = {
    [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
  };

  // convenience type for making all properties writeable
  type Writeable<T> = { -readonly [P in keyof T]: T[P] };

  // all callable functions in 2d contexts
  type Context2DFn = PickByType<
    Context2D,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    Function
  >;

  // add some properties to the 2d contexts
  interface CanvasRenderingContext2D {
    __cloned: boolean;
    __withoutSideEffects: Context2DFn;
  }
  interface OffscreenCanvasRenderingContext2D {
    __cloned: boolean;
    __withoutSideEffects: Context2DFn;
  }

  // add a history to the canvas objects
  interface HTMLCanvasElement {
    __history: Context2DHistory;
  }
  interface OffscreenCanvas {
    __history: Context2DHistory;
  }
}

// a list of all drawing functions in 2d contexts
export const DRAWING_FN_PROPS = [
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
] as const satisfies Partial<Array<keyof Context2D>>;

export function isDrawingFn(
  property: string,
): property is (typeof DRAWING_FN_PROPS)[number] {
  return DRAWING_FN_PROPS.includes(
    property as (typeof DRAWING_FN_PROPS)[number],
  );
}
