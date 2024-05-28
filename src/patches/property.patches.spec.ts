import { expect } from '@esm-bundle/chai';

import { AvailableFilter } from '../enums/available-filter.enum.js';
import { applyPropertyPatches } from './property.patches.js';

describe('patches/property.patches', () => {
  let canvas: HTMLCanvasElement;
  let context: CanvasRenderingContext2D;

  before(() => {
    applyPropertyPatches(HTMLCanvasElement, CanvasRenderingContext2D);
  });

  beforeEach(() => {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d')!;
  });

  afterEach(() => {
    canvas.__skipFilterPatch = false;
  });

  it('should apply internal skip flag property', () => {
    expect(canvas).to.have.property('__skipFilterPatch');
  });

  it('should set internal skip flag property default', () => {
    expect(canvas.__skipFilterPatch).to.be.false;
  });

  it('should apply internal mirror context', () => {
    expect(canvas).to.have.property('__currentPathMirror');
  });

  it('should set internal mirror context default', () => {
    expect(canvas.__currentPathMirror).to.be.undefined;
  });

  it('should prepare filter property', () => {
    expect(context).to.have.property('filter');
  });

  it('should set filter property default', () => {
    expect(context.filter).to.equal(AvailableFilter.None);
  });
});
