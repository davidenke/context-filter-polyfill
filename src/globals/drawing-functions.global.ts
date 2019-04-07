// all functions that somehow force the canvas to
// actually draw something which should adopt the
// given filters
// TODO: what about clipping?
export const DRAWING_FUNCTIONS = [
  'clearRect',
  // 'clip',
  'drawImage',

  'fill',
  'fillRect',
  'fillText',

  'stroke',
  'strokeRect',
  'strokeText'
];
