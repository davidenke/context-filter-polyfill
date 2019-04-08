// detects feature availability
export const supportsContextFilters = () => 'filter' in CanvasRenderingContext2D.prototype;

// creates an offscreen context matching the origin
export const createOffscreenContext = (original: CanvasRenderingContext2D): CanvasRenderingContext2D => {
  // prepare a non-patched canvas
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.height = original.canvas.height;
  canvas.width = original.canvas.width;

  // we won't patch the mirror as it will lead to a loop
  Object.defineProperty(canvas, '__skipFilterPatch', { value: true });

  // get context
  return canvas.getContext('2d');
};
