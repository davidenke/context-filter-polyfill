import { AvailableFilter } from '../enums/available-filter.enum';
import { SUPPORTED_FILTERS } from '../globals/supported-filters.global';

// applies the given filter to the provided canvas 2d context
export const applyFilter = (context: CanvasRenderingContext2D, canvasFilters: CanvasFilters['filter']) => {
  // read current canvas content
  // TODO: we need the current path only instead
  const input = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

  // parse applied filters and call implementations
  const filtered = canvasFilters
    // filters are separated by whitespace
    .split(' ')
    // filters may have options within appended brackets
    .map(filter => filter.match(/(\w+)\((.*)\)/si).slice(1, 3) as [AvailableFilter, string])
    // apply all filters
    .reduce((raw, [filter, options]) => {
      // do we have a appropriate filter implementation?
      if (SUPPORTED_FILTERS.has(filter)) {
        // then filter and return the result
        return SUPPORTED_FILTERS.get(filter)(raw, options);
      }
      // nope, skip this
      return raw;
    }, input);

  // set back the filtered image data
  context.putImageData(filtered, 0, 0);
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

// TODO: we're assuming pixel based values for now only, so adopt to other lengths as well
// https://developer.mozilla.org/en-US/docs/Web/CSS/length
export const normalizeLength = (length: string): number => {
  return parseFloat(length);
};
