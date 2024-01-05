import { expect } from '@esm-bundle/chai';
import { imageDataMock } from '../mocks/mock.data';
import { prepareTestBed, imageSample } from '../utils/test.utils';
import { invert } from './invert.filter';

describe('filters/invert', () => {
  const size = 30;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.height = canvas.width = size;
    context = canvas.getContext('2d')!;
    context.putImageData(imageDataMock, 0, 0);
  });

  it('should always return a context', () => {
    expect(invert(context)).to.be.instanceOf(CanvasRenderingContext2D);
    expect(invert(context, '1')).to.be.instanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, size, size).data.toString();
    const dataAfter = invert(context).getImageData(0, 0, size, size).data.toString();
    expect(dataBefore).to.equal(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, size, size).data.toString();
    const dataAfter = invert(context, '1')
      .getImageData(0, 0, size, size, { colorSpace: 'srgb' })
      .data.toString();
    expect(dataBefore).not.to.equal(dataAfter);
  });

  it('should apply the filter properly', () => {
    const context = prepareTestBed({ filters: ['invert(.9)'] });
    const image = context.getImageData(0, 0, 6, 6).data;
    expect(`${image}`).to.equal(
      imageSample(`
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 025,229,229,255, 025,229,229,255, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 025,229,229,255, 025,229,229,255, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
      `),
    );
  });
});
