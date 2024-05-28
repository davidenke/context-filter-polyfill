import { expect } from '@esm-bundle/chai';

import { imageDataMock } from '../mocks/mock.data.js';
import { brightness } from './brightness.filter.js';

describe('filters/brightness', () => {
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
    expect(brightness(context)).to.be.instanceOf(CanvasRenderingContext2D);
    expect(brightness(context, '2')).to.be.instanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context
      .getImageData(0, 0, width, height)
      .data.toString();
    const dataAfter = brightness(context)
      .getImageData(0, 0, width, height)
      .data.toString();
    expect(dataBefore).to.equal(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context
      .getImageData(0, 0, width, height)
      .data.toString();
    const dataAfter = Array.from(
      brightness(context, '2').getImageData(0, 0, width, height).data,
    );
    expect(dataBefore).not.to.equal(dataAfter);
  });
});
