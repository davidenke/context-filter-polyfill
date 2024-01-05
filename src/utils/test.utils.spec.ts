import { expect } from '@esm-bundle/chai';
import { generateImageSample, imageSample, prepareTestBed } from './test.utils';

// test the test utils :)
describe('utils/test.utils', () => {
  describe('imageSample', () => {
    it('should remove all whitespace, newlines and trailing comma', () => {
      expect(
        imageSample(`
          0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
          0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        `),
      ).to.equal(
        '0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
      );
    });

    it('should replace all tripled zeros with a single one', () => {
      expect(
        imageSample(`
          000,000,000,000, 255,000,000,020, 000,000,004,000,
          000,000,000,000, 255,000,000,255, 000,000,000,000,
        `),
      ).to.equal('0,0,0,0,255,0,0,20,0,0,4,0,0,0,0,0,255,0,0,255,0,0,0,0');
    });
  });

  describe('generateImageSample', () => {
    it('should deliver a formatted sample', () => {
      const data = new Uint8ClampedArray([
        0, 0, 0, 0, 255, 23, 4, 255, 0, 0, 0, 0, 255, 23, 4, 255,
      ]);
      expect(
        generateImageSample(data, { groupEvery: 4, newLineEvery: 4 * 2, insetSpaces: 4 }),
      ).to.equal(
        `    000,000,000,000, 255,023,004,255,
    000,000,000,000, 255,023,004,255,`,
      );
    });
  });

  describe('prepareTestBed', () => {
    it('should return a 2D context', () => {
      expect(prepareTestBed()).to.be.instanceOf(CanvasRenderingContext2D);
    });

    it('should return a canvas with the given height', () => {
      expect(prepareTestBed({ vh: 100 }).canvas.height).to.equal(100);
    });

    it('should return a canvas with a centered rectangular shape', () => {
      const context = prepareTestBed({ height: 2, width: 2, vh: 6, vw: 6, color: 0xffffff });
      const image = context.getImageData(0, 0, 6, 6).data;
      expect(`${image}`).to.equal(
        imageSample(
          `
          0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
          0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
          0,0,0,0, 0,0,0,0, 1,1,1,1, 1,1,1,1, 0,0,0,0, 0,0,0,0,
          0,0,0,0, 0,0,0,0, 1,1,1,1, 1,1,1,1, 0,0,0,0, 0,0,0,0,
          0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
          0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,0,0,
        `,
          true,
        ),
      );
    });

    it('should add the canvas to the DOM if requested', () => {
      const context = prepareTestBed({ addDOM: true });
      expect(document.body.contains(context.canvas)).to.be.true;
    });
  });
});
