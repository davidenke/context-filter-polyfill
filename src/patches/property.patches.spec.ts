import { AvailableFilter } from '../enums/available-filter.enum';
import { applyPropertyPatches } from './property.patches';

describe('patches/property.patches', () => {

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  beforeAll(() => {
    applyPropertyPatches(HTMLCanvasElement, CanvasRenderingContext2D);
  });

  beforeEach(() => {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
  });

  afterEach(() => {
    canvas['__skipFilterPatch'] = false;
  });


  it('should apply internal skip flag property', () => {
    expect(canvas).toHaveProperty('__skipFilterPatch');
  });

  it('should set internal skip flag property default', () => {
    expect(canvas['__skipFilterPatch']).toBeFalsy();
  });


  it('should apply internal mirror context', () => {
    expect(canvas).toHaveProperty('__currentPathMirror');
  });

  it('should set internal mirror context default', () => {
    expect(canvas['__currentPathMirror']).toBeUndefined();
  });


  it('should prepare filter property', () => {
    expect(context).toHaveProperty('filter');
  });

  it('should set filter property default', () => {
    expect(context.filter).toBe(AvailableFilter.None);
  });

});
