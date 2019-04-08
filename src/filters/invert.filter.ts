import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const invert: Filter = (context, invert = '0') => {
  const amount = normalizeNumberPercentage(invert);
  const { width, height } = context.canvas;
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;
  const { length } = data;
  console.log('invert', amount)

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

  // set back the image data
  context.putImageData(imageData, 0, 0);
};
