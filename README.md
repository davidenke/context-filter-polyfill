# context-filter-polyfill

[![Build Status](https://travis-ci.org/davidenke/context-filter-polyfill.svg?branch=master)](https://travis-ci.org/davidenke/context-filter-polyfill)

https://davidenke.github.io/context-filter-polyfill/

Polyfills [`CanvasRenderingContext2d.filter`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) capability of adopting CSS3 filters to canvas contexts at least partially.

Successfully tested on
* macOS Safari
* iOS Safari
* Windows 10 IE11
* Windows 10 Edge 16-18

## Supported filters
* [`url`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#url()) ✗
* [`blur`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#blur()) ✔
* [`brightness`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#brightness()) ✔
* [`contrast`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#contrast()) ✔
* [`drop-shadow`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#drop-shadow()) ✔
* [`grayscale`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#grayscale()) ✔
* [`hue-rotate`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#hue-rotate()) ✔
* [`invert`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#invert()) ✔
* [`none`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#none()) ✔
* [`opacity`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#opacity()) ✔
* [`saturate`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#saturate()) ✔
* [`sepia`](https://developer.mozilla.org/en-US/docs/Web/CSS/filter#sepia()) ✔

## See it in action
Just open the [integration demo](https://davidenke.github.io/context-filter-polyfill/) on Safari / iOS or IE11.

## Strategy
The polyfill is applied by the following steps:

1. monkey patching all properties of the `CanvasRenderingContext2d`
1. monkey patching all getters and setters of the `CanvasRenderingContext2d`
1. monkey patching all methods of the `CanvasRenderingContext2d`


These patches are proxying all changes to a **offscreen canvas** which applies the appropriate filter polyfills everytime a _drawing 
function_ is called:

* `clearRect`
* `drawImage`
* `fill`
* `fillRect`
* `fillText`
* `stroke`
* `strokeRect`
* `strokeText`

The contents of the **offscreen canvas** are applied back to the original canvas and is then resetted.
