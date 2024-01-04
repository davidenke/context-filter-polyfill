declare global {
  interface HTMLCanvasElement {
    __currentPathMirror?: CanvasRenderingContext2D;
    __skipFilterPatch?: boolean;
  }
}

export {};
