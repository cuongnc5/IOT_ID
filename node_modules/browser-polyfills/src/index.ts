import * as setPolyfill from 'es6-set';
import * as mapPolyfill from 'es6-map';
import * as arrayFindPolyfill from 'array.prototype.find';
import * as arrayFindIndexPolyfill from 'array.prototype.findindex';
import * as arrayFromPolyfill from 'array.from';
import * as objectValuesPolyfill from 'object.values';
import * as objectAssignPolyfill from 'object.assign';
import * as promisePolyfill from 'promise-polyfill/src/polyfill';
import * as setAsap from 'setasap';
import * as rafPolyfill from 'raf';

interface WindowWithPromise extends Window {
  Map: typeof mapPolyfill;
  Set: typeof setPolyfill;
  Promise: typeof promisePolyfill | undefined;
}

declare var window: WindowWithPromise;

if (!window.Set) {
  window.Set = setPolyfill;
}

if (!window.Map) {
  window.Map = mapPolyfill;
}

if (!window.Promise) {
  window.Promise = promisePolyfill;
  window.Promise._immediateFn = setAsap;
}

// tslint:disable-next-line:no-any
if (!(Array.prototype as any).find) {
  arrayFindPolyfill.shim();
}

// tslint:disable-next-line:no-any
if (!(Array.prototype as any).findIndex) {
  arrayFindIndexPolyfill.shim();
}

// tslint:disable-next-line:no-any
if (!(Array as any).from) {
  arrayFromPolyfill.shim();
}

// tslint:disable-next-line:no-any
if (!(Object as any).values) {
  objectValuesPolyfill.shim();
}

// tslint:disable-next-line:no-any
if (!(Object as any).assign) {
  objectAssignPolyfill.shim();
}

if (!window.requestAnimationFrame || !window.cancelAnimationFrame) {
  window.requestAnimationFrame = rafPolyfill;
  window.cancelAnimationFrame = rafPolyfill.cancel;
}

import 'whatwg-fetch';

const finalFetch = window.fetch;
const finalPromise: typeof promisePolyfill = window.Promise;

window.fetch = (input, init) => {
  try {
    return finalFetch(input, init);
  } catch (error) {
    return new finalPromise((_, reject) => reject(error));
  }
};
