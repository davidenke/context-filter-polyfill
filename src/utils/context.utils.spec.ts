import { createOffscreenContext, supportsContextFilters } from './context.utils';

describe('utils/context.utils', () => {

  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;
  let offscreen: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas') as HTMLCanvasElement;
    context = canvas.getContext('2d');
    offscreen = createOffscreenContext(context);
  });

  it('should detect filter support', () => {
    expect(supportsContextFilters()).toBeTruthy();
  });


  it('should create an offscreen canvas', () => {
    expect(offscreen).toBeInstanceOf(CanvasRenderingContext2D);
    expect(offscreen).not.toBe(context);
  });

  it('should adopt dimensions to offscreen canvas', () => {
    expect(offscreen.canvas.height).toBe(canvas.height);
    expect(offscreen.canvas.width).toBe(canvas.width);
  });

  it('should set an internal property flag to skip', () => {
    expect(offscreen.canvas).toHaveProperty('__skipFilterPatch');
  });

});
