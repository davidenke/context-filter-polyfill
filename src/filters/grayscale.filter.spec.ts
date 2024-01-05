import { expect } from '@esm-bundle/chai';
import { imageDataMock } from '../mocks/mock.data';
import { prepareTestBed, imageSample } from '../utils/test.utils';
import { grayscale } from './grayscale.filter';

describe('filters/grayscale', () => {
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
    expect(grayscale(context)).to.be.instanceOf(CanvasRenderingContext2D);
    expect(grayscale(context, '1')).to.be.instanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = grayscale(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).to.equal(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = Array.from(grayscale(context, '1').getImageData(0, 0, width, height).data);
    expect(dataBefore).not.to.equal(dataAfter);
  });

  it('should apply the filter properly', () => {
    const context = prepareTestBed({ filters: ['grayscale(50%)'] });
    const image = context.getImageData(0, 0, 6, 6).data;
    expect(`${image}`).to.equal(
      imageSample(`
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 155,027,027,255, 155,027,027,255, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 155,027,027,255, 155,027,027,255, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
        000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000, 000,000,000,000,
      `),
    );
  });
});
