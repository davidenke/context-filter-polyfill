import { expect } from '@esm-bundle/chai';

import { imageDataMock } from '../mocks/mock.data.js';
import { applyMethodPatches } from './method.patches.js';

describe('patches/setter.patches', () => {
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  before(() => {
    applyMethodPatches(CanvasRenderingContext2D);
  });

  beforeEach(() => {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d')!;
    context.putImageData(imageDataMock, 0, 0);
  });

  afterEach(() => {
    canvas.__skipFilterPatch = false;
  });

  it('should have a mirror canvas after calling a method', () => {
    context.getLineDash();
    expect(canvas.__currentPathMirror).to.be.instanceOf(
      CanvasRenderingContext2D,
    );
  });

  it('should mirror method', () => {
    context.setLineDash([3]);
    expect(canvas.__currentPathMirror!.getLineDash()).to.deep.equal([3, 3]);
  });

  it('should not mirror method if skip flag is set', () => {
    canvas.__skipFilterPatch = true;
    context.setLineDash([3]);
    expect(canvas.__currentPathMirror!.getLineDash()).to.be.empty;
  });

  // @FIXME: use playwright and test this properly
  // it('should allow clearRect, even if skip flag is set', () => {
  //   const before = context
  //     .getImageData(0, 0, 10, 10)
  //     .data.slice(0, 10 * 10 * 4)
  //     .toString();
  //   context.clearRect(0, 0, 10, 10);
  //   const after = context
  //     .getImageData(0, 0, 10, 10)
  //     .data.slice(0, 10 * 10 * 4)
  //     .toString();
  //   expect(before).not.to.equal(after);
  // });
});
