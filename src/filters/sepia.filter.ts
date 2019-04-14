import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const sepia: Filter = (context, amount = '0') => {
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
  // https://github.com/licson0729/CanvasEffects/blob/master/CanvasEffects.js#L464-L466
  for (let i = 0; i < length; i += 4) {
    const r = data[i + 0];
    const g = data[i + 1];
    const b = data[i + 2];
    data[i + 0] = (0.393 * r + 0.769 * g + 0.189 * b) * amount + r * (1 - amount);
    data[i + 1] = (0.349 * r + 0.686 * g + 0.168 * b) * amount + g * (1 - amount);
    data[i + 2] = (0.272 * r + 0.534 * g + 0.131 * b) * amount + b * (1 - amount);
  }

  // set back image data to context
  context.putImageData(imageData, 0, 0);

  // return the context itself
  return context;
};
