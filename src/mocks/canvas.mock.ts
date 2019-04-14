import { ContextMock } from './context.mock';

export class CanvasMock implements Partial<HTMLCanvasElement> {

  private readonly _context = new ContextMock(this as unknown as HTMLCanvasElement);

  width = 100;

  height = 134;

  getContext(contextId: '2d', contextAttributes?: CanvasRenderingContext2DSettings): CanvasRenderingContext2D | null;
  getContext(contextId: 'webgl' | 'experimental-webgl', contextAttributes?: WebGLContextAttributes): WebGLRenderingContext | null;
  getContext(_contextId: string, _contextAttributes?: {}): CanvasRenderingContext2D | WebGLRenderingContext | null {
    return this._context as unknown as CanvasRenderingContext2D;
  }

}
