
declare module 'raf' {
  type cafType = (handle: number) => void;
  type rafType = (callback: FrameRequestCallback) => number;

  interface Raf extends rafType {
    cancel: cafType;
  }

  let requestAnimationFrame: Raf;
  export = requestAnimationFrame;
}
