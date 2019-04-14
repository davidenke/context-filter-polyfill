import { CanvasMock } from '../mocks/canvas.mock';
import { ContextMock } from '../mocks/context.mock';
import { invert } from './invert.filter';

describe('filters/invert', () => {

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
    expect(invert(context)).toBeInstanceOf(ContextMock);
    expect(invert(context, '1')).toBeInstanceOf(ContextMock);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = invert(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).toEqual(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = invert(context, '1').getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).not.toEqual(dataAfter);
  });

});
