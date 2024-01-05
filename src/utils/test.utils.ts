// DO ONLY USE IN TESTS

/**
 * To compare image data in a readable way, we do string comparison.
 * In order to do so, we need to remove all whitespace, newlines and trailing comma.
 * Additionally, all leading zeros are removed with a single one, for better formatting.
 *
 * Optionally, full color images can be converted by passing `true` as second
 * argument. This will replace all `1` with `255` and allows defining more compact
 * image samples (e.g. `0,1,1,1,0` instead of `0,255,255,255,0`).
 */
export function imageSample(data: string, fullColor = false): string {
  const cleaned = data
    // remove all whitespace and newlines
    .replaceAll(/\s|\n/g, '')
    // remove leading zeros
    .replaceAll(/0*(\d+)/g, '$1')
    // remove trailing comma
    .replace(/,$/, '');
  if (fullColor) return cleaned.replaceAll('1', '255');
  return cleaned;
}

/**
 * Prepares a sample to be applied to a test bed.
 * @internal
 */
export function generateImageSample(
  data: Uint8ClampedArray,
  {
    groupEvery = 4,
    newLineEvery = 4 * 6,
    insetSpaces = 4,
  }: Partial<{ groupEvery: number; newLineEvery: number; insetSpaces: number }> = {},
): string {
  const inset = ' '.repeat(insetSpaces);
  return data.reduce((sample, value, index) => {
    const isFirst = index === 0;
    const isGroupEnd = index % groupEvery === 0;
    const isNewLine = index % newLineEvery === 0;

    if (isFirst) sample += inset;
    if (!isFirst && isNewLine) sample += `\n${inset}`;
    if (!isFirst && !isNewLine && isGroupEnd) sample += ' ';
    sample += `${value.toString().padStart(3, '0')},`;

    return sample;
  }, '');
}

/**
 * Prepares a canvas test bed with a centered rectangular shape.
 */
export function prepareTestBed({
  addDOM = true,
  filters = [],
  h = 2,
  w = 2,
  vh = 6,
  vw = 6,
  color = 0xf00,
}: Partial<{
  addDOM: boolean;
  filters: string[];
  h: number;
  w: number;
  vh: number;
  vw: number;
  color: number;
}> = {}): CanvasRenderingContext2D {
  // create canvas
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  canvas.height = vh;
  canvas.width = vw;

  // apply filters
  if (filters.length) context.filter = filters.join(' ');

  // add to DOM
  if (addDOM) document.body.appendChild(canvas);

  // draw rectangle
  context.fillStyle = `#${color.toString(16)}`;
  context.fillRect((vw - w) / 2, (vh - h) / 2, w, h);

  // deliver
  return canvas.getContext('2d')!;
}
