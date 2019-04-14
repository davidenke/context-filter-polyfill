import { CanvasMock } from '../mocks/canvas.mock';
import { ContextMock } from '../mocks/context.mock';
import { hueRotate } from './hue-rotate.filter';

describe('filters/hue-rotate', () => {

  let width: number;
  let height: number;
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  beforeEach(() => {
    canvas = new CanvasMock() as unknown as HTMLCanvasElement;
    context = canvas.getContext('2d');
    ({ width, height } = canvas);
  });


  it('should always return a context', () => {
    expect(hueRotate(context)).toBeInstanceOf(ContextMock);
    expect(hueRotate(context, '180deg')).toBeInstanceOf(ContextMock);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = hueRotate(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).toEqual(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = Array.from(hueRotate(context, '180deg').getImageData(0, 0, width, height).data);
    expect(dataBefore).not.toEqual(dataAfter);
  });

});
