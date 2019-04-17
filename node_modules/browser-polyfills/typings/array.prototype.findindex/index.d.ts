
declare module 'array.prototype.findindex' {
  interface ArrayFindIndex extends Function {
    shim: Function;
    getPolyfill: Function;
    implementation: Function;
  }

  let arrayFindIndexPolyfill: ArrayFindIndex;
  export = arrayFindIndexPolyfill;
}
