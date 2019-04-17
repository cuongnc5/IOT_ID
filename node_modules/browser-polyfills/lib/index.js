"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var setPolyfill = require("es6-set");
var mapPolyfill = require("es6-map");
var arrayFindPolyfill = require("array.prototype.find");
var arrayFindIndexPolyfill = require("array.prototype.findindex");
var arrayFromPolyfill = require("array.from");
var objectValuesPolyfill = require("object.values");
var objectAssignPolyfill = require("object.assign");
var promisePolyfill = require("promise-polyfill/src/polyfill");
var setAsap = require("setasap");
var rafPolyfill = require("raf");
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
if (!Array.prototype.find) {
    arrayFindPolyfill.shim();
}
if (!Array.prototype.findIndex) {
    arrayFindIndexPolyfill.shim();
}
if (!Array.from) {
    arrayFromPolyfill.shim();
}
if (!Object.values) {
    objectValuesPolyfill.shim();
}
if (!Object.assign) {
    objectAssignPolyfill.shim();
}
if (!window.requestAnimationFrame || !window.cancelAnimationFrame) {
    window.requestAnimationFrame = rafPolyfill;
    window.cancelAnimationFrame = rafPolyfill.cancel;
}
require("whatwg-fetch");
var finalFetch = window.fetch;
var finalPromise = window.Promise;
window.fetch = function (input, init) {
    try {
        return finalFetch(input, init);
    }
    catch (error) {
        return new finalPromise(function (_, reject) { return reject(error); });
    }
};
