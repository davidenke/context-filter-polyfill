import { SUPPORTED_FILTERS } from '../globals/supported-filters.global.js';
import type { Context2D } from './proxy.utils.js';

// applies the given filter to the provided canvas 2d context
export const applyFilter = (
  context: Context2D,
  canvasFilters: CanvasFilters['filter'] = 'none',
) => {
  // parse applied filters and call implementations
  canvasFilters
    // filters are separated by whitespace
    .match(/([-a-z]+)(?:\(([\w\d\s.%-]*)\))?/gim)
    // filters may have options within appended brackets
    ?.map(
      filter =>
        filter.match(/([-a-z]+)(?:\((.*)\))?/i)?.slice(1, 3) as [
          string,
          string,
        ],
    )
    // apply all filters
    .reduce((input, [filter, options]) => {
      // do we have a appropriate filter implementation?
      if (SUPPORTED_FILTERS.has(filter)) {
        // then filter and return the result
        return SUPPORTED_FILTERS.get(filter)!(
          input,
          ...(options || '').split(' '),
        );
      }
      // nope, skip this
      return input;
    }, context);
};

// filter options are often represented as number-percentage,
// means that they'll be percentages like `50%` or floating
// in-between 0 and 1 like `.5`, so we normalize them.
// https://developer.mozilla.org/en-US/docs/Web/CSS/filter#number-percentage
export const normalizeNumberPercentage = (percentage: string): number => {
  let normalized = parseFloat(percentage);

  // check for percentages and divide by a hundred
  if (/%\s*?$/i.test(percentage)) {
    normalized /= 100;
  }

  return normalized;
};

// normalizes angles to a float between 0 and 1.
// https://developer.mozilla.org/en-US/docs/Web/CSS/angle#Units
export const normalizeAngle = (angle: string): number => {
  let normalized = parseFloat(angle);
  const unit = angle.slice(normalized.toString().length);

  // check for units and align accordingly
  switch (unit) {
    case 'deg':
      normalized /= 360;
      break;
    case 'grad':
      normalized /= 400;
      break;
    case 'rad':
      normalized /= 2 * Math.PI;
      break;
  }

  return normalized;
};

// TODO: we're assuming pixel based values for now only, so adopt to other lengths as well
// https://developer.mozilla.org/en-US/docs/Web/CSS/length
export const normalizeLength = (length: string): number => {
  return parseFloat(length);
};
