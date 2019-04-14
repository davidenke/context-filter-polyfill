import { CanvasMock } from '../mocks/canvas.mock';
import { ContextMock } from '../mocks/context.mock';
import { contrast } from './contrast.filter';

describe('filters/contrast', () => {

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
    expect(contrast(context)).toBeInstanceOf(ContextMock);
    expect(contrast(context, '2')).toBeInstanceOf(ContextMock);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = Array.from(context.getImageData(0, 0, width, height).data);
    const dataAfter = Array.from(contrast(context).getImageData(0, 0, width, height).data);
    expect(dataBefore).toEqual(expect.arrayContaining(dataAfter));
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = Array.from(context.getImageData(0, 0, width, height).data);
    const dataAfter = Array.from(contrast(context, '2').getImageData(0, 0, width, height).data);
    expect(dataBefore).not.toEqual(expect.arrayContaining(dataAfter));
  });

});
