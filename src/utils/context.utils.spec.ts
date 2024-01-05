import { expect } from '@esm-bundle/chai';
import {
  createOffscreenContext,
  supportsCanvas,
  supportsContext2D,
  supportsContextFilters,
} from './context.utils';

describe('utils/context.utils', () => {
  describe('supportsCanvas', () => {
    it('should detect filter support', () => {
      expect(supportsCanvas()).to.be.true;
    });
  });

  describe('supportsContext2D', () => {
    it('should detect filter support', () => {
      expect(supportsContext2D()).to.be.true;
    });
  });

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
      const offscreen = createOffscreenContext();
      expect(offscreen).to.be.instanceOf(CanvasRenderingContext2D);
      expect(offscreen).not.to.equal(context);
    });

    it('should adopt dimensions to offscreen canvas', () => {
      const offscreen = createOffscreenContext();
      expect(offscreen.canvas.height).to.equal(canvas.height);
      expect(offscreen.canvas.width).to.equal(canvas.width);
    });

    it('should set an internal property flag to skip', () => {
      const offscreen = createOffscreenContext();
      expect(offscreen.canvas).to.have.property('__skipFilterPatch');
    });
  });
});
