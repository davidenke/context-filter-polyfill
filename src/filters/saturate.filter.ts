import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const saturate: Filter = (context, saturation = '0') => {
  let amount = normalizeNumberPercentage(saturation);
  console.log('saturate', amount);

  // do not manipulate without proper amount
  if (amount <= 0) {
    return context;
  }

  const { height, width } = context.canvas;
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;
  const lumR = (1 - amount) * .3086;
  const lumG = (1 - amount) * .6094;
  const lumB = (1 - amount) * .0820;
  const shiftW = width << 2;

  for (let j = 0; j < height; j++) {
    const offset = j * shiftW;
    for (let i = 0; i < width; i++) {
      const pos = offset + (i << 2);
      const r = data[pos + 0];
      const g = data[pos + 1];
      const b = data[pos + 2];

      data[pos + 0] = ((lumR + amount) * r) + (lumG * g) + (lumB * b);
      data[pos + 1] = (lumR * r) + ((lumG + amount) * g) + (lumB * b);
      data[pos + 2] = (lumR * r) + (lumG * g) + ((lumB + amount) * b);
    }

  }

  // set back image data to context
  context.putImageData(imageData, 0, 0);

  // return the context itself
  return context;
};
