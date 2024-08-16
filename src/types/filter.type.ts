export type Filter = (
  context: CanvasRenderingContext2D,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...options: any[]
) => CanvasRenderingContext2D;
