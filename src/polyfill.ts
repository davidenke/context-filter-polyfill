import './filters/blur.filter.js';
import './filters/brightness.filter.js';
import './filters/contrast.filter.js';
import './filters/drop-shadow.filter.js';
import './filters/grayscale.filter.js';
import './filters/hue-rotate.filter.js';
import './filters/invert.filter.js';
import './filters/none.filter.js';
import './filters/opacity.filter.js';
import './filters/saturate.filter.js';
import './filters/sepia.filter.js';

import { applyFilter } from './utils/filter.utils.js';
import { applyProxy } from './utils/proxy.utils.js';

declare global {
  interface WindowEventMap {
    'context-filter-polyfill:draw': CustomEvent<{
      original: CanvasRenderingContext2D;
      clone: CanvasRenderingContext2D;
      drawFn: string;
      drawArgs: unknown[];
    }>;
  }
}

applyProxy({
  onDraw(ctx, drawFn, drawArgs) {
    // prevent recursive loop on cloned contexts
    if (ctx.__cloned) {
      // @ts-expect-error - all good things come in threes
      ctx.__withoutSideEffects[drawFn](...drawArgs);
      return;
    }

    // prepare a clone of the canvas to to adopt its settings
    const _canvas = ctx.canvas.cloneNode() as HTMLCanvasElement;
    const clone = _canvas.getContext('2d')!;
    clone.__cloned = true;

    // we have some special cases here:
    switch (drawFn) {
      // here we have to prepare the clone for the draw operation,
      // and later, we  have to clear and re-apply it completely
      case 'clearRect':
        // first, we need the original contents in the clone
        clone.drawImage(ctx.canvas, 0, 0);
        // apply the history of the original context to the clone
        ctx.canvas.__history.applyTo(clone);
        // clear the clone
        clone.clearRect(...(drawArgs as [number, number, number, number]));
        // empty original, as we'll apply everything from the clone back to it
        ctx.__withoutSideEffects.reset();

        break;

      // when resetting the context, we need to clear the history as well
      case 'reset':
        ctx.canvas.__history.clear();
        ctx.__withoutSideEffects.reset();
        break;

      // all other drawing functions simply get applied to the clone
      // and then the clone is drawn back onto the original canvas
      default:
        // apply the history of the original context to the clone
        ctx.canvas.__history.applyTo(clone);
        // apply the draw function itself
        // @ts-expect-error - all good things come in threes
        clone[drawFn](...drawArgs);
        // now apply the latest filter to the clone (if any)
        applyFilter(
          clone,
          ctx.canvas.__history.lastValueOf('filter')?.value as string,
        );

        break;
    }

    // the canvas needs to be prepared for the next draw,
    // that means resetting the transformation matrix
    ctx.__withoutSideEffects.resetTransform();

    // add the result to the original canvas
    ctx.__withoutSideEffects.drawImage(clone.canvas, 0, 0);

    // notify for debug purposes
    window.dispatchEvent(
      new CustomEvent('context-filter-polyfill:draw', {
        detail: { original: ctx, clone, drawFn, drawArgs },
      }),
    );
  },
});
