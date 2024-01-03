// add filter property
import { AvailableFilter } from '../enums/available-filter.enum';

// apply property patches
export function applyPropertyPatches(
  canvas: new () => HTMLCanvasElement,
  context: new () => CanvasRenderingContext2D,
) {
  Object.defineProperty(canvas.prototype, '__skipFilterPatch', { writable: true, value: false });
  Object.defineProperty(canvas.prototype, '__currentPathMirror', {
    writable: true,
    value: undefined,
  });
  Object.defineProperty(context.prototype, 'filter', {
    writable: true,
    value: AvailableFilter.None,
  });
}
