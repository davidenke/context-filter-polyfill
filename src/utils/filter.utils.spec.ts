import { AvailableFilter } from '../enums/available-filter.enum';
import { SUPPORTED_FILTERS } from '../globals/supported-filters.global';
import { imageDataMock } from '../mocks/mock.data';
import {
  applyFilter,
  normalizeAngle,
  normalizeLength,
  normalizeNumberPercentage,
} from './filter.utils';

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
      const blur = jest.fn();
      SUPPORTED_FILTERS.set(AvailableFilter.Blur, blur);

      // const before = context.getImageData(0, 0, 30, 30).data;
      applyFilter(context, 'blur(5px)');
      // const after = context.getImageData(0, 0, 30, 30).data;

      expect(blur).toHaveBeenNthCalledWith(1, context, '5px');
      // @FIXME: use playwright and test this properly
      // expect(before).not.toEqual(after);
    });

    it('should apply multiple filters', () => {
      applyFilter(context, 'blur(5px) rotate(180deg)');
      expect(context.getImageData(0, 0, 1, 1).data).not.toEqual(imageDataMock.data);
    });
  });

  describe('normalizeNumberPercentage', () => {
    it('should not change a float', () => {
      expect(normalizeNumberPercentage('1.5')).toBe(1.5);
    });

    it('should normalize a percentage to a float', () => {
      expect(normalizeNumberPercentage('150%')).toBe(1.5);
    });
  });

  describe('normalizeLength', () => {
    it('should parse lengths to float', () => {
      expect(normalizeLength('1.5')).toBe(1.5);
    });

    it('should floats from values without decimals', () => {
      expect(normalizeLength('23')).toBe(23);
    });
  });

  describe('normalizeAngle', () => {
    it('should parse angle from degrees', () => {
      expect(normalizeAngle('180deg')).toBe(0.5);
    });

    it('should parse angle from gradians', () => {
      expect(normalizeAngle('200grad')).toBe(0.5);
    });

    it('should parse angle from radians', () => {
      expect(normalizeAngle(`${Math.PI}rad`)).toBe(0.5);
    });

    it('should parse angle from turns', () => {
      expect(normalizeAngle('0.5turn')).toBe(0.5);
    });
  });
});
