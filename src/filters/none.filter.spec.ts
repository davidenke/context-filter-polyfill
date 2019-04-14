import { CanvasMock } from '../mocks/canvas.mock';
import { ContextMock } from '../mocks/context.mock';
import { none } from './none.filter';

describe('filters/none', () => {

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
    expect(none(context)).toBeInstanceOf(ContextMock);
  });

  it('should not manipulate image data', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = none(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).toEqual(dataAfter);
  });

});
