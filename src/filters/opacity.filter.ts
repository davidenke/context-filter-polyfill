import { Filter } from '../types/filter.type';

export const opacity: Filter = (image, amount: string) => {
  console.log('opacity', amount, image.data);
  for (let i = 0, len = image.data.length; i < len; i+4) {

  }

  return image;
};
