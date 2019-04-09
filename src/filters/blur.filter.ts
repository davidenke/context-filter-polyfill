import { Filter } from '../types/filter.type';
import { normalizeLength } from '../utils/filter.utils';

export const blur: Filter = (imageData, radius = '0') => {
  const amount = normalizeLength(radius);
  const { data, width } = imageData;
  const { length } = data;
  console.log('blur', amount);

  // https://codepen.io/zhaojun/pen/zZmRQe
  // https://gist.github.com/6174/9403745
  // TODO: tweak, as it is too blurry
  // https://www.script-tutorials.com/html5-canvas-image-effects-app-adding-blur/
  const p1 = 0.99;
  const p2 = 0.99;
  const p3 = 0.99;
  const er = 0; // extra red
  const eg = 0; // extra green
  const eb = 0; // extra blue

  for (let rate = 0; rate < amount; rate += 1) {
    for (let i = 0, n = length; i < n; i += 4) {
      const iMW = 4 * width;
      let iSumOpacity = 0;
      let iSumRed = 0;
      let iSumGreen = 0;
      let iSumBlue = 0;
      let iCnt = 0;
      // data of close pixels (from all 8 surrounding pixels)
      const aCloseData = [
        i - iMW - 4, i - iMW, i - iMW + 4, // top pixels
        i - 4, i + 4, // middle pixels
        i + iMW - 4, i + iMW, i + iMW + 4 // bottom pixels
      ];
      // calculating Sum value of all close pixels
      for (let e = 0; e < aCloseData.length; e += 1) {
        if (aCloseData[e] >= 0 && aCloseData[e] <= length - 3) {
          iSumOpacity += data[aCloseData[e]];
          iSumRed += data[aCloseData[e] + 1];
          iSumGreen += data[aCloseData[e] + 2];
          iSumBlue += data[aCloseData[e] + 3];
          iCnt += 1;
        }
      }
      // apply average values
      data[i] = (iSumOpacity / iCnt)*p1+er;
      data[i+1] = (iSumRed / iCnt)*p2+eg;
      data[i+2] = (iSumGreen / iCnt)*p3+eb;
      data[i+3] = (iSumBlue / iCnt);
    }
  }

  return imageData;
};
