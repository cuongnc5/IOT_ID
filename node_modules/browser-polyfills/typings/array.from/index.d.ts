
declare module 'array.from' {
  interface ArrayFrom extends Function {
    shim: Function;
    getPolyfill: Function;
    implementation: Function;
  }

  let arrayFromPolyfill: ArrayFrom;
  export = arrayFromPolyfill;
}
