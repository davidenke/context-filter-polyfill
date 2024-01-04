import { expect } from '@esm-bundle/chai';
import { imageDataMock } from '../mocks/mock.data';
import { hueRotate } from './hue-rotate.filter';

describe('filters/hue-rotate', () => {
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
    expect(hueRotate(context)).to.be.instanceOf(CanvasRenderingContext2D);
    expect(hueRotate(context, '180deg')).to.be.instanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = hueRotate(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).to.equal(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = Array.from(
      hueRotate(context, '180deg').getImageData(0, 0, width, height).data,
    );
    expect(dataBefore).not.to.equal(dataAfter);
  });
});
