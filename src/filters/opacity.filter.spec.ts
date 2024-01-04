import { expect } from '@esm-bundle/chai';
import { imageDataMock } from '../mocks/mock.data';
import { opacity } from './opacity.filter';

describe('filters/opacity', () => {
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
    expect(opacity(context)).to.be.instanceOf(CanvasRenderingContext2D);
    expect(opacity(context, '.5')).to.be.instanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = opacity(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).to.equal(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = Array.from(opacity(context, '.5').getImageData(0, 0, width, height).data);
    expect(dataBefore).not.to.equal(dataAfter);
  });

  it('should have empty alpha channels on full opacity', () => {
    const all = Array.from(opacity(context, '0').getImageData(0, 0, width, height).data)
      .filter((_, index) => (index + 1) % 4 === 0)
      .reduce((sum, current) => sum + current, 0);
    expect(all).to.equal(0);
  });
});
