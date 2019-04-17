
declare module 'object.assign' {
  interface ObjectAssign extends Function {
    shim: Function;
    getPolyfill: Function;
    implementation: Function;
  }

  let objectAssignPolyfill: ObjectAssign;
  export = objectAssignPolyfill;
}
