import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const grayscale: Filter = (imageData, grayscale = '0') => {
  let amount = normalizeNumberPercentage(grayscale);
  console.log('grayscale', amount)

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
  for (let i = 0; i < length; i += 4) {
    const luma = data[i] * .2126 + data[i + 1] * .7152 + data[i + 2] * .0722;
    data[i + 0] += (luma - data[i + 0]) * amount;
    data[i + 1] += (luma - data[i + 1]) * amount;
    data[i + 2] += (luma - data[i + 2]) * amount;
  }

  return imageData;
};
