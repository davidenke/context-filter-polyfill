import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const opacity: Filter = (imageData, opacity = '1') => {
  let amount = normalizeNumberPercentage(opacity);
  console.log('opacity', amount)

  // do not manipulate without proper amount
  if (amount < 0) {
    return imageData;
  }

  // a maximum of 100%
  if (amount >= 1) {
    amount = 1;
  }

  const { data } = imageData;
  const { length } = data;

  // in rgba world, the 4th entry is the alpha channel
  for (let i = 3; i < length;) {
    data[i] *= amount;
    i += 4;
  }

  return imageData;
};
