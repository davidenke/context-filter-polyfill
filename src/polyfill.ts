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
    }>;
  }
}

/**
 * Applies the given command history to the given context.
 */
function applyHistory(
  context: CanvasRenderingContext2D,
  history: CanvasRenderingContext2DHistory,
) {
  history.forEach(({ type, prop, value, args }) => {
    switch (type) {
      case 'set':
        // @ts-expect-error - naaaah, it'll work
        context[prop] = value;
        break;
      case 'apply':
        // @ts-expect-error - sure
        context[prop](...args);
        break;
    }
  });
}

applyProxy({
  onDraw(ctx, drawFn, drawArgs) {
    // prevent recursive loop on cloned contexts
    if (ctx.__cloned) {
      ctx.__skipNextDraw = true;
      // @ts-expect-error - all good things come in threes
      ctx[drawFn](...drawArgs);
      return;
    }

    // prepare a clone of the canvas to to adopt its settings
    const _canvas = ctx.canvas.cloneNode() as HTMLCanvasElement;
    const clone = _canvas.getContext('2d')!;
    clone.__cloned = true;

    // apply the history of the original context to the clone
    applyHistory(clone, ctx.canvas.__history);

    // apply the draw function itself
    // @ts-expect-error - all good things come in threes
    clone[drawFn](...drawArgs);

    // now apply the latest filter to the clone (if any)
    const filter = ctx.canvas.__history.findLast(
      ({ prop }) => prop === 'filter',
    );
    if (filter?.value) {
      applyFilter(clone, filter.value as string);
    }

    // add the result to the original canvas
    ctx.__skipNextDraw = true;
    ctx.drawImage(clone.canvas, 0, 0);

    // notify for debug purposes
    window.dispatchEvent(
      new CustomEvent('context-filter-polyfill:draw', {
        detail: { original: ctx, clone },
      }),
    );
  },
});
