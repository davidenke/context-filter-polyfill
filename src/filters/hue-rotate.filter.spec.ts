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
    expect(hueRotate(context)).toBeInstanceOf(CanvasRenderingContext2D);
    expect(hueRotate(context, '180deg')).toBeInstanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = hueRotate(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).toEqual(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = Array.from(
      hueRotate(context, '180deg').getImageData(0, 0, width, height).data,
    );
    expect(dataBefore).not.toEqual(dataAfter);
  });
});
