// detects feature availability
export const supportsCanvas = () => typeof HTMLCanvasElement !== 'undefined';
export const supportsContext2D = () => typeof CanvasRenderingContext2D !== 'undefined';
export const supportsContextFilters = () => 'filter' in CanvasRenderingContext2D.prototype;

// creates an offscreen context matching the origin
export const createOffscreenContext = (): CanvasRenderingContext2D => {
  // prepare a non-patched canvas
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d')!;

  // we won't patch the mirror as it will lead to a loop
  Object.defineProperty(canvas, '__skipFilterPatch', { value: true });

  // get context
  return context;
};
