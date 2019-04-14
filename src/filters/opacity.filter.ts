import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const opacity: Filter = (context, amount = '1') => {
  amount = normalizeNumberPercentage(amount);

  // do not manipulate without proper amount
  if (amount < 0) {
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

  // in rgba world, the 4th entry is the alpha channel
  for (let i = 3; i < length; i += 4) {
    data[i] *= amount;
  }

  // set back image data to context
  context.putImageData(imageData, 0, 0);

  // return the context itself
  return context;
};
