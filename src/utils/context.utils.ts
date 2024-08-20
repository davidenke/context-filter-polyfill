import { CanvasRenderingContext2DHistory } from './history.utils.js';

declare global {
  // some utility types
  type PickByType<T, Value> = {
    [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P];
  };

  type Writeable<T> = { -readonly [P in keyof T]: T[P] };

  // all callable functions in CanvasRenderingContext2D
  type CanvasRenderingContext2DFn = PickByType<
    CanvasRenderingContext2D,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    Function
  >;

  // add some properties to the 2d context
  interface CanvasRenderingContext2D {
    __cloned: boolean;
    __withoutSideEffects: CanvasRenderingContext2DFn;
  }

  // add a history to the canvas element
  interface HTMLCanvasElement {
    __history: CanvasRenderingContext2DHistory;
  }
}

// a list of all drawing functions in CanvasRenderingContext2D
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
] as const satisfies Partial<Array<keyof CanvasRenderingContext2D>>;

export function isDrawingFn(
  property: string,
): property is (typeof DRAWING_FN_PROPS)[number] {
  return DRAWING_FN_PROPS.includes(
    property as (typeof DRAWING_FN_PROPS)[number],
  );
}
