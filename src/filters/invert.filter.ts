import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const invert: Filter = (imageData, invert = '0') => {
  let amount = normalizeNumberPercentage(invert);
  console.log('invert', amount)

  // do not manipulate without proper amount
  if (amount <= 0) {
    return imageData;
  }

  // a maximum of 100%
  if (amount >= 1) {
    amount = 1;
  }

  const { data } = imageData;
  const { length } = data;

  // in rgba world, every
  // n * 4 is red,
  // n * 4 + 1 green and
  // n * 4 + 2 is blue
  // the fourth can be skipped as it's the alpha channel
  for (let i = 0; i < length;) {
    data[i + 0] = Math.abs(data[i + 0] - 255 * amount);
    data[i + 1] = Math.abs(data[i + 1] - 255 * amount);
    data[i + 2] = Math.abs(data[i + 2] - 255 * amount);
    i += 4;
  }

  return imageData;
};
