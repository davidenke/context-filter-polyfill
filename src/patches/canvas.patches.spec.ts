import { expect } from '@esm-bundle/chai';
import { createOffscreenContext } from '../utils/context.utils';
import { applyCanvasPatches } from './canvas.patches';

describe('patches/canvas.patches', () => {
  it('should have a mirror canvas after setting a value', () => {
    // GIVEN
    applyCanvasPatches(HTMLCanvasElement);
    const canvas = document.createElement('canvas');
    canvas.__currentPathMirror = createOffscreenContext();

    // WHEN
    canvas.width = 400;

    // THEN
    expect(canvas.__currentPathMirror?.canvas.width).to.equal(400);
  });
});
