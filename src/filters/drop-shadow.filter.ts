import { Filter } from '../types/filter.type';
import { normalizeLength } from '../utils/filter.utils';

export const dropShadow: Filter = (context, offsetX: string, offsetY: string, blurOrColor?: string, color?: string) => {
  // normalize the params
  context.shadowOffsetX = normalizeLength(offsetX);
  context.shadowOffsetY = normalizeLength(offsetY);
  context.shadowBlur = color ? normalizeLength(blurOrColor || '0') : 0;
  context.shadowColor = color || blurOrColor || 'transparent';

  // return the context itself
  return context;
};
