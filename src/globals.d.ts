declare global {
  interface HTMLCanvasElement {
    __currentPathMirror?: boolean;
    __skipFilterPatch?: boolean;
  }
}

export {};
