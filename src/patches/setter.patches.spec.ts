import { applySetterPatches } from './setter.patches';

describe('patches/setter.patches', () => {

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  beforeAll(() => {
    applySetterPatches();
  });

  beforeEach(() => {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
  });

  afterEach(() => {
    canvas['__skipFilterPatch'] = false;
  });


  it('should not have a mirror canvas initially', () => {
    expect(canvas['__currentPathMirror']).toBeUndefined();
  });

  it('should have a mirror canvas after setting a value', () => {
    context.textAlign = 'right';
    expect(canvas['__currentPathMirror']).toBeInstanceOf(CanvasRenderingContext2D);
  });


  it('should mirror set property', () => {
    context.textAlign = 'center';
    expect(canvas['__currentPathMirror'].textAlign).toBe('center');
  });

  it('should mirror get property', () => {
    context.textAlign = 'center';
    canvas['__currentPathMirror'].textAlign = 'end';
    expect(context.textAlign).toBe('end');
  });


  it('should not mirror property if skip flag is set', () => {
    canvas['__skipFilterPatch'] = true;
    context.textAlign = 'center';
    expect(canvas['__currentPathMirror']).toBeUndefined();
  });

});
