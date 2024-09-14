import type { Context2D } from '../utils/proxy.utils';

export type Filter = (
  context: Context2D,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...options: any[]
) => Context2D;
