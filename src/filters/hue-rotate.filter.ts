import { Filter } from '../types/filter.type';
import { normalizeAngle } from '../utils/filter.utils';

export const hueRotate: Filter = (context, rotation = '0deg') => {
  const amount = normalizeAngle(rotation);

  // do not manipulate without proper amount
  if (amount <= 0) {
    return context;
  }

  const { height, width } = context.canvas;
  const imageData = context.getImageData(0, 0, width, height);
  const { data } = imageData;

  // in rgba world, every
  // n * 4 + 0 is red,
  // n * 4 + 1 green and
  // n * 4 + 2 is blue
  // the fourth can be skipped as it's the alpha channel
  // https://github.com/makoConstruct/canvas-hue-rotate/blob/master/hueShiftCanvas.js
  const h = (amount % 1 + 1) % 1; // wraps the angle to unit interval, even when negative
  const th = h * 3;
  const thr = Math.floor(th);
  const d = th - thr;
  const b = 1 - d;
  let ma, mb, mc;
  let md, me, mf;
  let mg, mh, mi;

  switch (thr) {
    case 0:
      ma = b;
      mb = 0;
      mc = d;
      md = d;
      me = b;
      mf = 0;
      mg = 0;
      mh = d;
      mi = b;
      break;
    case 1:
      ma = 0;
      mb = d;
      mc = b;
      md = b;
      me = 0;
      mf = d;
      mg = d;
      mh = b;
      mi = 0;
      break;
    case 2:
      ma = d;
      mb = b;
      mc = 0;
      md = 0;
      me = d;
      mf = b;
      mg = b;
      mh = 0;
      mi = d;
      break;
  }
  // do the pixels
  let place = 0;
  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      place = 4 * (y * width + x);

      const ir = data[place + 0];
      const ig = data[place + 1];
      const ib = data[place + 2];

      data[place + 0] = Math.floor(ma * ir + mb * ig + mc * ib);
      data[place + 1] = Math.floor(md * ir + me * ig + mf * ib);
      data[place + 2] = Math.floor(mg * ir + mh * ig + mi * ib);
    }
  }

  // set back image data to context
  context.putImageData(imageData, 0, 0);

  // return the context itself
  return context;
};
