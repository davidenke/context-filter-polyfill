import { Filter } from '../types/filter.type';
import { normalizeNumberPercentage } from '../utils/filter.utils';

export const opacity: Filter = (context, opacity = '0') => {
  const amount = normalizeNumberPercentage(opacity);
  const { width, height } = context.canvas;
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;
  const { length } = data;
  console.log('opacity', amount)

  // in rgba world, the 4th entry is the alpha channel
  for (let i = 3; i < length;) {
    data[i] *= amount;
    i += 4;
  }

  // set back the image data
  context.putImageData(imageData, 0, 0);
};
