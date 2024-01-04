import { expect } from '@esm-bundle/chai';
import { imageDataMock } from '../mocks/mock.data';
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
});
