import { AvailableFilter } from './enums/available-filter.enum.js';
import { blur } from './filters/blur.filter.js';
import { brightness } from './filters/brightness.filter.js';
import { contrast } from './filters/contrast.filter.js';
import { dropShadow } from './filters/drop-shadow.filter.js';
import { grayscale } from './filters/grayscale.filter.js';
import { hueRotate } from './filters/hue-rotate.filter.js';
import { invert } from './filters/invert.filter.js';
// add supported filters here by mapping the available
import { none } from './filters/none.filter.js';
import { opacity } from './filters/opacity.filter.js';
import { saturate } from './filters/saturate.filter.js';
import { sepia } from './filters/sepia.filter.js';
import { SUPPORTED_FILTERS } from './globals/supported-filters.global.js';
import { applyMethodPatches } from './patches/method.patches.js';
// the patches we'll be using
import { applyPropertyPatches } from './patches/property.patches.js';
import { applySetterPatches } from './patches/setter.patches.js';

// filter to the imported, implemented function
SUPPORTED_FILTERS.set(AvailableFilter.None, none);
SUPPORTED_FILTERS.set(AvailableFilter.Blur, blur);
SUPPORTED_FILTERS.set(AvailableFilter.Brightness, brightness);
SUPPORTED_FILTERS.set(AvailableFilter.Contrast, contrast);
SUPPORTED_FILTERS.set(AvailableFilter.DropShadow, dropShadow);
SUPPORTED_FILTERS.set(AvailableFilter.Grayscale, grayscale);
SUPPORTED_FILTERS.set(AvailableFilter.HueRotate, hueRotate);
SUPPORTED_FILTERS.set(AvailableFilter.Invert, invert);
SUPPORTED_FILTERS.set(AvailableFilter.Opacity, opacity);
SUPPORTED_FILTERS.set(AvailableFilter.Saturate, saturate);
SUPPORTED_FILTERS.set(AvailableFilter.Sepia, sepia);

// we monkey-patch all context members to
// apply everything to the current mirror
applyPropertyPatches(HTMLCanvasElement, CanvasRenderingContext2D);
applySetterPatches(CanvasRenderingContext2D);
applyMethodPatches(CanvasRenderingContext2D);
