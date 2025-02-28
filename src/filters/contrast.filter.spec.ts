import { expect } from 'chai';

import { imageDataMock } from '../mocks/mock.data.js';
import type { Context2D } from '../utils/proxy.utils.js';
import { contrast } from './contrast.filter.js';

describe('filters/contrast', () => {
  let width: number;
  let height: number;
  let canvas: HTMLCanvasElement;
  let context: Context2D;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    ({ height, width } = canvas);
    context = canvas.getContext('2d')!;
    context.putImageData(imageDataMock, 0, 0);
  });

  it('should always return a context', () => {
    expect(contrast(context)).to.be.instanceOf(CanvasRenderingContext2D);
    expect(contrast(context, '2')).to.be.instanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context
      .getImageData(0, 0, width, height)
      .data.toString();
    const dataAfter = contrast(context)
      .getImageData(0, 0, width, height)
      .data.toString();
    expect(dataBefore).to.equal(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context
      .getImageData(0, 0, width, height)
      .data.toString();
    const dataAfter = Array.from(
      contrast(context, '2').getImageData(0, 0, width, height).data,
    );
    expect(dataBefore).not.to.equal(dataAfter);
  });
});
