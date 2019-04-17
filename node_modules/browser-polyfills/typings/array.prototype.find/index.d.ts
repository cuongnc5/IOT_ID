
declare module 'array.prototype.find' {
  interface ArrayFind extends Function {
    shim: Function;
    getPolyfill: Function;
    implementation: Function;
  }

  let arrayFindPolyfill: ArrayFind;
  export = arrayFindPolyfill;
}
