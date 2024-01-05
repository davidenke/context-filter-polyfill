declare global {
  interface HTMLCanvasElement {
    __currentPathMirror?: CanvasRenderingContext2D;
    __skipFilterPatch?: boolean;
  }

  interface Window {
    __forceApplyContextFiltersPolyfill?: true;
  }
}

export {};
