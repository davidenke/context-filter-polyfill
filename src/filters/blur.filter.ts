import { Filter } from '../types/filter.type';
import { normalizeLength } from '../utils/filter.utils';

export const blur: Filter = (imageData, radius = '0') => {
  const amount = normalizeLength(radius);
  const { data, width } = imageData;
  const { length } = data;
  console.log('blur', amount, width);

  // https://www.script-tutorials.com/html5-canvas-image-effects-app-adding-blur/
  const rgba = 4;
  const rgbaWidth = rgba * width;

  for (let rate = 0; rate < amount; rate++) {
    for (let i = 0; i < length; i += rgba) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let count = 0;
      // data of close pixels (from all 8 surrounding pixels)
      const closePixels = [
        // top pixels
        i - rgbaWidth - rgba,
        i - rgbaWidth,
        i - rgbaWidth + rgba,
        // center pixels
        i - rgba,
        i + rgba,
        // bottom pixels
        i + rgbaWidth - rgba,
        i + rgbaWidth,
        i + rgbaWidth + rgba
      ];
      // calculating sum value of all close pixels
      for (let e = 0; e < closePixels.length; e++) {
        if (closePixels[e] >= 0 && closePixels[e] <= length - 3) {
          a += data[closePixels[e] + 0];
          r += data[closePixels[e] + 1];
          g += data[closePixels[e] + 2];
          b += data[closePixels[e] + 3];
          count += 1;
        }
      }
      // apply average values
      data[i + 0] = a / count;
      data[i + 1] = r / count;
      data[i + 2] = g / count;
      data[i + 3] = b / count;
    }
  }

  return imageData;
};
