// feature detector
import { isBrowser, supportsContextFilters } from './utils/detection.utils.js';

if (isBrowser() && !supportsContextFilters()) {
  import('./polyfill.js');
}
