import type { Context2D } from './proxy.utils';

export type Context2DHistoryEntry = {
  type: 'set' | 'apply' | 'draw';
  prop: keyof CanvasRenderingContext2D;
  value?: unknown;
  args?: unknown[];
};

export class Context2DHistory extends Set<Context2DHistoryEntry> {
  applyTo(context: Context2D): void {
    this.forEach(({ type, prop, value, args }) => {
      switch (type) {
        case 'set':
          // @ts-expect-error - `canvas` property is readonly
          context[prop] = value;
          break;
        case 'apply':
          // @ts-expect-error - our types do not narrow the `type` tp specific properties
          context[prop](...args);
          break;
      }
    });
  }

  lastValueOf(
    prop: keyof CanvasRenderingContext2D,
  ): Context2DHistoryEntry | undefined {
    return [...this].findLast(entry => entry.prop === prop);
  }
}
