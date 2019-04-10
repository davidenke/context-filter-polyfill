import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const saturate: Filter = (imageData, saturation = '0') => {
  let amount = normalizeNumberPercentage(saturation);
  console.log('saturate', amount);

  // do not manipulate without proper amount
  if (amount <= 0) {
    return imageData;
  }

  const { data } = imageData;
  const { length } = data;
  const adjust = -saturation;

  // in rgba world, every
  // n * 4 is red,
  // n * 4 + 1 green and
  // n * 4 + 2 is blue
  // the fourth can be skipped as it's the alpha channel
  // https://github.com/fabricjs/fabric.js/blob/master/src/filters/saturate_filter.class.js
  // TODO: improve the filter as it is does not match
  // TODO: check this: https://github.com/keithwhor/canvasBlurRect/blob/master/canvas_blur_rect.js#L10
  for (let i = 0; i < length; i += 4) {
    const max = Math.max(data[i + 0], data[i + 1], data[i + 2]);
    data[i + 0] += max !== data[i + 0] ? (max - data[i]) * adjust : 0;
    data[i + 1] += max !== data[i + 1] ? (max - data[i + 1]) * adjust : 0;
    data[i + 2] += max !== data[i + 2] ? (max - data[i + 2]) * adjust : 0;
  }

  return imageData;
};
