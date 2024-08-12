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


// use proxy and reflect to apply filters
const handler = {
  get(target, prop, receiver) {
    console.log('get', target.constructor.name, { prop });
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value, receiver) {
    console.log('set', target.constructor.name, { prop, value });
    return Reflect.set(target, prop, value, receiver);
  },
} satisfies ProxyHandler<CanvasRenderingContext2D | HTMLCanvasElement>;

proxyBuiltin(CanvasRenderingContext2D.prototype, handler);
proxyBuiltin(HTMLCanvasElement.prototype, handler);
