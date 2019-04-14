import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const brightness: Filter = (context, amount = '1') => {
  amount = normalizeNumberPercentage(amount);

  // do not manipulate without proper amount
  if (amount === 1) {
    return context;
  }

  // align minimum
  if (amount < 0) {
    amount = 0;
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
    data[i + 0] *= amount;
    data[i + 1] *= amount;
    data[i + 2] *= amount;
  }

  // set back image data to context
  context.putImageData(imageData, 0, 0);

  // return the context itself
  return context;
};
