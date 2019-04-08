// detects feature availability
export const supportsContextFilters = () => 'filter' in CanvasRenderingContext2D.prototype;

// creates an offscreen context matching the origin
export const createOffscreenContext = (origin: CanvasRenderingContext2D): CanvasRenderingContext2D => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const context = canvas.getContext.call(canvas, '2d', undefined, true);

  // apply original dimensions and transforms
  canvas.height = origin.canvas.height;
  canvas.width = origin.canvas.width;
  context.setTransform(origin.getTransform());

  return context;
};
