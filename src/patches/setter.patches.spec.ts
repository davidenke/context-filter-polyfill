import { expect } from '@esm-bundle/chai';

import { applySetterPatches } from './setter.patches.js';

describe('patches/setter.patches', () => {
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  before(() => {
    applySetterPatches(CanvasRenderingContext2D);
  });

  beforeEach(() => {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d')!;
  });

  afterEach(() => {
    canvas.__skipFilterPatch = false;
  });

  it('should have a mirror canvas after setting a value', () => {
    context.textAlign = 'right';
    expect(canvas.__currentPathMirror).to.be.instanceOf(
      CanvasRenderingContext2D,
    );
  });

  it('should mirror set property', () => {
    context.textAlign = 'center';
    expect(canvas.__currentPathMirror!.textAlign).to.equal('center');
  });

  it('should mirror get property', () => {
    context.textAlign = 'center';
    canvas.__currentPathMirror!.textAlign = 'end';
    expect(context.textAlign).to.equal('end');
  });

  it('should not mirror property if skip flag is set', () => {
    canvas.__skipFilterPatch = true;
    context.textAlign = 'center';
    expect(canvas.__currentPathMirror).to.be.undefined;
  });
});
