import { mockData } from './mockData';

export class ContextMock implements Partial<CanvasRenderingContext2D> {

  private _imageData: ImageData = {
    data: new Uint8ClampedArray(mockData),
    width: this.canvas.width,
    height: this.canvas.height
  };

  get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  constructor(private _canvas: HTMLCanvasElement) {}

  getImageData(_sx: number, _sy: number, _sw: number, _sh: number): ImageData {
    return { ...this._imageData, data: new Uint8ClampedArray(Array.from(this._imageData.data)) };
  }

  putImageData(imagedata: ImageData, dx: number, dy: number): void;
  putImageData(imagedata: ImageData, dx: number, dy: number, dirtyX: number, dirtyY: number, dirtyWidth: number, dirtyHeight: number): void;
  putImageData(imagedata: ImageData, _dx: number, _dy: number, _dirtyX?: number, _dirtyY?: number, _dirtyWidth?: number, _dirtyHeight?: number) {
    this._imageData = imagedata;
  }

}
