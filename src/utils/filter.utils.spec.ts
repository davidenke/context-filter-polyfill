import { normalizeAngle, normalizeLength, normalizeNumberPercentage } from './filter.utils';

describe('utils/filter.utils', () => {

  it('should not change a float', () => {
    expect(normalizeNumberPercentage('1.5')).toBe(1.5);
  });

  it('should normalize a percentage to a float', () => {
    expect(normalizeNumberPercentage('150%')).toBe(1.5);
  });


  it('should parse lengths to float', () => {
    expect(normalizeLength('1.5')).toBe(1.5);
  });


  it('should parse angle from degrees', () => {
    expect(normalizeAngle('180deg')).toBe(.5);
  });

  it('should parse angle from gradians', () => {
    expect(normalizeAngle('200grad')).toBe(.5);
  });

  it('should parse angle from radians', () => {
    expect(normalizeAngle(`${ Math.PI }rad`)).toBe(.5);
  });

  it('should parse angle from turns', () => {
    expect(normalizeAngle('0.5turn')).toBe(.5);
  });

});
