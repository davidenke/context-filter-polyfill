# context-filter-polyfill

[![Build Status](https://travis-ci.org/davidenke/context-filter-polyfill.svg?branch=master)](https://travis-ci.org/davidenke/context-filter-polyfill)

https://davidenke.github.io/context-filter-polyfill/

Polyfills [`CanvasRenderingContext2d.filter`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter) capability of adopting CSS3 filters to canvas contexts at least partially.

## See it in action
Just open the [integration demo](https://davidenke.github.io/context-filter-polyfill/) on Safari.

## Use case
tbd

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
