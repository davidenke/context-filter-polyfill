import { Filter } from '../types/filter.type';
import { normalizeLength } from '../utils/filter.utils';

export const dropShadow: Filter = (context, offsetX: string, offsetY: string, blurOrColor?: string, color?: string) => {
  // prepare a new temp canvas
  const shadowContext = document.createElement('canvas').getContext('2d');

  // normalize the params and apply to the temp context
  // be aware of different blur behavior in different browsers
  // s. https://github.com/fabricjs/fabric.js/issues/4402
  shadowContext.shadowOffsetX = normalizeLength(offsetX);
  shadowContext.shadowOffsetY = normalizeLength(offsetY);
  shadowContext.shadowBlur = color ? normalizeLength(blurOrColor || '0') : 0;
  shadowContext.shadowColor = color || blurOrColor || 'transparent';

  // draw over the contents applying the shadow
  shadowContext.drawImage(context.canvas, 0, 0);

  // set back shadowed contents
  const { width, height } = context.canvas;
  context.putImageData(shadowContext.getImageData(0, 0, width, height), 0, 0);

  // return the context itself
  return context;
};
