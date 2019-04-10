// add filter property
import { AvailableFilter } from '../enums/available-filter.enum';

// apply property patches
export function applyPropertyPatches() {
  Object.defineProperty(HTMLCanvasElement.prototype, '__skipFilterPatch', { writable: true, value: false });
  Object.defineProperty(HTMLCanvasElement.prototype, '__currentPathMirror', { writable: true, value: undefined });
  Object.defineProperty(CanvasRenderingContext2D.prototype, 'filter', { writable: true, value: AvailableFilter.None });
}
