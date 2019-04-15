import { Filter } from '../types/filter.type';
import { normalizeLength } from '../utils/filter.utils';

export const dropShadow: Filter = (context, offsetX: string, offsetY: string, blurOrColor?: string, color?: string) => {
  // normalize the params
  context.shadowOffsetX = normalizeLength(offsetX);
  context.shadowOffsetY = normalizeLength(offsetY);
  context.shadowBlur = color ? normalizeLength(blurOrColor || '0') : 0;
  context.shadowColor = color || blurOrColor || 'transparent';

  const { shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor } = context;
  console.log(shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor)

  // return the context itself
  return context;
};
