// feature detector
import { isBrowser, supportsContextFilters } from './utils/context.utils.js';

if (isBrowser() && !supportsContextFilters()) {
  import('./polyfill.js');
}
