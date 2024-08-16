# context-filter-polyfill

[![Build Status](https://github.com/davidenke/context-filter-polyfill/actions/workflows/main.yml/badge.svg?branch=main)](https://github.com/davidenke/context-filter-polyfill)
[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]

Examples: https://davidenke.github.io/context-filter-polyfill/

Polyfills [`CanvasRenderingContext2d.filter`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) capability of adopting CSS3 filters to canvas contexts at least partially.

Right now ~~only WebKit [misses an implementation (Bugzilla #198416)](https://bugs.webkit.org/show_bug.cgi?id=198416)~~ all engines support it natively, despite Safari not having shipped it yet in the stable release channel.

## Installation

Add the polyfill to your page via script tag from a CDN:

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/context-filter-polyfill/dist/index.min.js"></script>
</head>
```

Or from npm:

```bash
npm install context-filter-polyfill
```

... and import it in your code:

```js
import 'context-filter-polyfill';
```

## Changes in 0.4

Since version 0.4.0 the method of how the polyfill is applied has been reworked.
It now polyfills the filter on each drawing function call instead of applying it once on the context in the end.

This results in more accurate behavior compared to the native implementation.

The [polyfilled and native results](https://davidenke.github.io/context-filter-polyfill/) can be compared with a non-WebKit browser like Firefox or Chrome.

## Supported filters

- [`url`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#url()>) ✗
- [`blur`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#blur()>) ✔
- [`brightness`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#brightness()>) ✔
- [`contrast`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#contrast()>) ✔
- [`drop-shadow`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#drop-shadow()>) ✔
- [`grayscale`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#grayscale()>) ✔
- [`hue-rotate`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#hue-rotate()>) ✔
- [`invert`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#invert()>) ✔
- [`none`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#none()>) ✔
- [`opacity`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#opacity()>) ✔
- [`saturate`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#saturate()>) ✔
- [`sepia`](<https://developer.mozilla.org/en-US/docs/Web/CSS/filter#sepia()>) ✔

## See it in action

Just open the [integration demo](https://davidenke.github.io/context-filter-polyfill/) on Safari / iOS.

## License

[MIT](LICENSE)

[npm-install-size-image]: https://badgen.net/packagephobia/install/context-filter-polyfill
[npm-install-size-url]: https://packagephobia.com/result?p=context-filter-polyfill
[npm-url]: https://npmjs.org/package/context-filter-polyfill
[npm-version-image]: https://badgen.net/npm/v/context-filter-polyfill
