import { expect } from '@esm-bundle/chai';
import { imageDataMock } from '../mocks/mock.data';
import { imageSample, prepareTestBed } from '../utils/test.utils';
import { blur } from './blur.filter';

describe('filters/blur', () => {
  let width: number;
  let height: number;
  let context: CanvasRenderingContext2D;

  beforeEach(() => {
    context = prepareTestBed();
    ({ height, width } = context.canvas);
    context.putImageData(imageDataMock, 0, 0);
  });

  afterEach(() => {
    context.canvas.remove();
  });

  it('should always return a context', () => {
    expect(blur(context)).to.be.instanceOf(CanvasRenderingContext2D);
    expect(blur(context, '1px')).to.be.instanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = blur(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).to.equal(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = Array.from(blur(context, '10px').getImageData(0, 0, width, height).data);
    expect(dataBefore).not.to.equal(dataAfter);
  });

  it('should apply the filter properly', () => {
    const context = prepareTestBed({ filters: ['blur(2px)'] });
    const image = context.getImageData(0, 0, 6, 6).data;
    expect(`${image}`).to.equal(
      imageSample(`
        255,000,000,009, 255,000,000,014, 255,000,000,018, 255,000,000,018, 255,000,000,014, 255,000,000,009,
        255,000,000,014, 255,000,000,023, 255,000,000,029, 255,000,000,029, 255,000,000,023, 255,000,000,014,
        255,000,000,018, 255,000,000,029, 255,000,000,036, 255,000,000,036, 255,000,000,029, 255,000,000,018,
        255,000,000,018, 255,000,000,029, 255,000,000,036, 255,000,000,036, 255,000,000,029, 255,000,000,018,
        255,000,000,014, 255,000,000,023, 255,000,000,029, 255,000,000,029, 255,000,000,023, 255,000,000,014,
        255,000,000,009, 255,000,000,014, 255,000,000,018, 255,000,000,018, 255,000,000,014, 255,000,000,009,
      `),
    );
  });
});
