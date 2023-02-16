import { createOffscreenContext, supportsContextFilters } from './context.utils';

describe('utils/context.utils', () => {
  describe('supportsContextFilters', () => {
    it('should detect filter support', () => {
      expect(supportsContextFilters()).toBeTruthy();
    });
  });

  describe('createOffscreenContext', () => {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    beforeEach(() => {
      canvas = document.createElement('canvas') as HTMLCanvasElement;
      context = canvas.getContext('2d')!;
    });

    it('should create an offscreen canvas', () => {
      const offscreen = createOffscreenContext(context);
      expect(offscreen).toBeInstanceOf(CanvasRenderingContext2D);
      expect(offscreen).not.toBe(context);
    });

    it('should adopt dimensions to offscreen canvas', () => {
      const offscreen = createOffscreenContext(context);
      expect(offscreen.canvas.height).toBe(canvas.height);
      expect(offscreen.canvas.width).toBe(canvas.width);
    });

    it('should set an internal property flag to skip', () => {
      const offscreen = createOffscreenContext(context);
      expect(offscreen.canvas).toHaveProperty('__skipFilterPatch');
    });
  });
});
