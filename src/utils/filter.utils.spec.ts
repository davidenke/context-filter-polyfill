import chai, { expect } from '@esm-bundle/chai';
import { spy } from 'sinon';
import { default as sinonChai } from 'sinon-chai-es';

import { AvailableFilter } from '../enums/available-filter.enum.js';
import { SUPPORTED_FILTERS } from '../globals/supported-filters.global.js';
import { imageDataMock } from '../mocks/mock.data.js';
import {
  applyFilter,
  normalizeAngle,
  normalizeLength,
  normalizeNumberPercentage,
} from './filter.utils.js';

chai.use(sinonChai);

describe('utils/filter.utils', () => {
  describe('applyFilter', () => {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    beforeEach(() => {
      canvas = document.createElement('canvas');
      context = canvas.getContext('2d')!;
      context.putImageData(imageDataMock, 0, 0);
    });

    it('should apply a blur filter', () => {
      const blur = spy();
      SUPPORTED_FILTERS.set(AvailableFilter.Blur, blur);

      const before = context.getImageData(0, 0, 30, 30).data;
      applyFilter(context, 'blur(5px)');
      const after = context.getImageData(0, 0, 30, 30).data;

      expect(blur).to.have.been.calledOnceWithExactly(context, '5px');
      expect(before).not.to.equal(after);
    });

    it('should apply multiple filters', () => {
      applyFilter(context, 'blur(5px) rotate(180deg)');
      expect(context.getImageData(0, 0, 1, 1).data).not.to.equal(
        imageDataMock.data,
      );
    });
  });

  describe('normalizeNumberPercentage', () => {
    it('should not change a float', () => {
      expect(normalizeNumberPercentage('1.5')).to.equal(1.5);
    });

    it('should normalize a percentage to a float', () => {
      expect(normalizeNumberPercentage('150%')).to.equal(1.5);
    });
  });

  describe('normalizeLength', () => {
    it('should parse lengths to float', () => {
      expect(normalizeLength('1.5')).to.equal(1.5);
    });

    it('should floats from values without decimals', () => {
      expect(normalizeLength('23')).to.equal(23);
    });
  });

  describe('normalizeAngle', () => {
    it('should parse angle from degrees', () => {
      expect(normalizeAngle('180deg')).to.equal(0.5);
    });

    it('should parse angle from gradians', () => {
      expect(normalizeAngle('200grad')).to.equal(0.5);
    });

    it('should parse angle from radians', () => {
      expect(normalizeAngle(`${Math.PI}rad`)).to.equal(0.5);
    });

    it('should parse angle from turns', () => {
      expect(normalizeAngle('0.5turn')).to.equal(0.5);
    });
  });
});
