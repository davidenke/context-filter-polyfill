import { CanvasMock } from '../mocks/canvas.mock';
import { ContextMock } from '../mocks/context.mock';
import { opacity } from './opacity.filter';

describe('filters/opacity', () => {

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
    expect(opacity(context)).toBeInstanceOf(ContextMock);
    expect(opacity(context, '.5')).toBeInstanceOf(ContextMock);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = opacity(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).toEqual(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = Array.from(opacity(context, '.5').getImageData(0, 0, width, height).data);
    expect(dataBefore).not.toEqual(dataAfter);
  });

  it('should have empty alpha channels on full opacity', () => {
    const all = Array
      .from(opacity(context, '0').getImageData(0, 0, width, height).data)
      .filter((_, index) => (index + 1) % 4 === 0)
      .reduce((sum, current) => sum + current, 0);
    expect(all).toBe(0);
  });

});
