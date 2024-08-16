// detects usage in browser
export const isBrowser = () =>
  typeof HTMLCanvasElement !== 'undefined' &&
  typeof CanvasRenderingContext2D !== 'undefined';

// detects feature availability
export const supportsContextFilters = () =>
  'filter' in CanvasRenderingContext2D.prototype;
