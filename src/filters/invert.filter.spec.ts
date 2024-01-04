import { expect } from '@esm-bundle/chai';
import { imageDataMock } from '../mocks/mock.data';
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

  // @FIXME: use playwright and test this properly
  // it('should manipulate image data if arguments match', () => {
  //   const dataBefore = context.getImageData(0, 0, size, size).data.toString();
  //   const dataAfter = invert(context, '1')
  //     .getImageData(0, 0, size, size, { colorSpace: 'srgb' })
  //     .data.toString();
  //   expect(dataBefore).not.to.equal(dataAfter);
  // });
});
