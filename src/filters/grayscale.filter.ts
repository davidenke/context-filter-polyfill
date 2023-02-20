import type { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const grayscale: Filter = (context, amount = '0') => {
  amount = normalizeNumberPercentage(amount);

  // do not manipulate without proper amount
  if (amount <= 0) {
    return context;
  }

  // a maximum of 100%
  if (amount > 1) {
    amount = 1;
  }

  const { height, width } = context.canvas;
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;
  const { length } = data;

  // in rgba world, every
  // n * 4 + 0 is red,
  // n * 4 + 1 green and
  // n * 4 + 2 is blue
  // the fourth can be skipped as it's the alpha channel
  for (let i = 0; i < length; i += 4) {
    const luma = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
    data[i + 0] += (luma - data[i + 0]) * amount;
    data[i + 1] += (luma - data[i + 1]) * amount;
    data[i + 2] += (luma - data[i + 2]) * amount;
  }

  // set back image data to context
  context.putImageData(imageData, 0, 0);

  // return the context itself
  return context;
};
