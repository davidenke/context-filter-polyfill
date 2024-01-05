import { expect } from '@esm-bundle/chai';
import { imageDataMock } from '../mocks/mock.data';
import { prepareTestBed, imageSample } from '../utils/test.utils';
import { none } from './none.filter';

describe('filters/none', () => {
  let width: number;
  let height: number;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    ({ height, width } = canvas);
    context = canvas.getContext('2d')!;
    context.putImageData(imageDataMock, 0, 0);
  });

  it('should always return a context', () => {
    expect(none(context)).to.be.instanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = none(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).to.equal(dataAfter);
  });

  it('should apply the filter properly', () => {
    const context = prepareTestBed({ filters: ['none'] });
    const image = context.getImageData(0, 0, 6, 6).data;
    expect(`${image}`).to.equal(
      imageSample(`
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 255,000,000,255, 255,000,000,255, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 255,000,000,255, 255,000,000,255, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
      `),
    );
  });
});
