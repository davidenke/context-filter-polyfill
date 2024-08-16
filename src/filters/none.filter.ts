import { SUPPORTED_FILTERS } from '../globals/supported-filters.global.js';
import type { Filter } from '../types/filter.type.js';

export const none: Filter = context => context;

SUPPORTED_FILTERS.set('none', none);
