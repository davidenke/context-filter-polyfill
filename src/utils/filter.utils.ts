import { AvailableFilter } from '../enums/available-filter.enum';
import { SUPPORTED_FILTERS } from '../globals/supported-filters.global';

// applies the given filter to the provided canvas 2d context
export const applyFilter = (context: CanvasRenderingContext2D, canvasFilters: CanvasFilters['filter']) => {
  // read current canvas content
  // TODO: we need the current path only instead
  // const input = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

  // parse applied filters and call implementations
  canvasFilters
    // filters are separated by whitespace
    .split(' ')
    // filters may have options within appended brackets
    .map(filter => filter.match(/(\w+)\((.*)\)/si).slice(1, 3) as [AvailableFilter, string])
    // filter out unsupported
    .filter(([filter]) => SUPPORTED_FILTERS.has(filter))
    // apply all filters
    .forEach(([filter, options]) => SUPPORTED_FILTERS.get(filter)(context, options));
};

// filter options are often represented as number-percentage,
// means that they'll be percentages like `50%` or floating
// in-between 0 and 1 like `.5`, so we normalize them.
// https://developer.mozilla.org/en-US/docs/Web/CSS/filter#number-percentage
export const normalizeNumberPercentage = (percentage: string): number => {
  let normalized = parseFloat(percentage);

  // check for percentages and divide by a hundred
  if (percentage.trimRight().endsWith('%')) {
    normalized /= 100;
  }

  return normalized;
};
