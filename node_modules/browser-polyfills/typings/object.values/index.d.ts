
declare module 'object.values' {
  interface ObjectValues extends Function {
    shim: Function;
    getPolyfill: Function;
    implementation: Function;
  }

  let objectValuesPolyfill: ObjectValues;
  export = objectValuesPolyfill;
}
