import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const brightness: Filter = (imageData, brightness = '0') => {
  let amount = normalizeNumberPercentage(brightness);
  console.log('brightness', amount)

  // do not manipulate without proper amount
  if (amount <= 1) {
    return imageData;
  }

  const { data } = imageData;
  const { length } = data;

  // in rgba world, every
  // n * 4 is red,
  // n * 4 + 1 green and
  // n * 4 + 2 is blue
  // the fourth can be skipped as it's the alpha channel
  for (let i = 0; i < length; i += 4) {
    data[i + 0] *= amount;
    data[i + 1] *= amount;
    data[i + 2] *= amount;
  }

  return imageData;
};
