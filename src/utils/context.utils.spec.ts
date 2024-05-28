import { expect } from '@esm-bundle/chai';

import {
  createOffscreenContext,
  supportsContextFilters,
} from './context.utils.js';

describe('utils/context.utils', () => {
  describe('supportsContextFilters', () => {
    it('should detect filter support', () => {
      expect(supportsContextFilters()).to.be.true;
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
      expect(offscreen).to.be.instanceOf(CanvasRenderingContext2D);
      expect(offscreen).not.to.equal(context);
    });

    it('should adopt dimensions to offscreen canvas', () => {
      const offscreen = createOffscreenContext(context);
      expect(offscreen.canvas.height).to.equal(canvas.height);
      expect(offscreen.canvas.width).to.equal(canvas.width);
    });

    it('should set an internal property flag to skip', () => {
      const offscreen = createOffscreenContext(context);
      expect(offscreen.canvas).to.have.property('__skipFilterPatch');
    });
  });
});
