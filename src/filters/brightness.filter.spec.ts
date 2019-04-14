import { CanvasMock } from '../mocks/canvas.mock';
import { ContextMock } from '../mocks/context.mock';
import { brightness } from './brightness.filter';

describe('filters/brightness', () => {

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
    expect(brightness(context)).toBeInstanceOf(ContextMock);
    expect(brightness(context, '2')).toBeInstanceOf(ContextMock);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = brightness(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).toEqual(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = Array.from(brightness(context, '2').getImageData(0, 0, width, height).data);
    expect(dataBefore).not.toEqual(dataAfter);
  });

});
