import { imageDataMock } from '../mocks/mock.data';
import { saturate } from './saturate.filter';

describe('filters/saturate', () => {
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
    expect(saturate(context)).toBeInstanceOf(CanvasRenderingContext2D);
    expect(saturate(context, '5')).toBeInstanceOf(CanvasRenderingContext2D);
  });

  it('should not manipulate image data with defaults', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = saturate(context).getImageData(0, 0, width, height).data.toString();
    expect(dataBefore).toEqual(dataAfter);
  });

  it('should manipulate image data if arguments match', () => {
    const dataBefore = context.getImageData(0, 0, width, height).data.toString();
    const dataAfter = Array.from(saturate(context, '5').getImageData(0, 0, width, height).data);
    expect(dataBefore).not.toEqual(dataAfter);
  });
});
