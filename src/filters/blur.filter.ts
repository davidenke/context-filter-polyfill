import { Filter } from '../types/filter.type';
import { normalizeLength } from '../utils/filter.utils';

export const blur: Filter = (context, radius = '0') => {
  const amount = normalizeLength(radius);
  console.log('blur', amount);

  // TODO: tweak, as it is too blurry
  // https://codepen.io/zhaojun/pen/zZmRQe
  // https://gist.github.com/6174/9403745
  let sum = 0;
  let delta = 5;
  let alpha_left = 1 / (2 * Math.PI * delta * delta);
  let step = amount < 3 ? 1 : 2;
  for (let y = -amount; y <= amount; y += step) {
    for (let x = -amount; x <= amount; x += step) {
      let weight = alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta));
      sum += weight;
    }
  }
  for (let y = -amount; y <= amount; y += step) {
    for (let x = -amount; x <= amount; x += step) {
      context.globalAlpha = alpha_left * Math.exp(-(x * x + y * y) / (2 * delta * delta)) / sum * amount;
      context.drawImage(context.canvas, x, y);
    }
  }
  context.globalAlpha = 1;
};
