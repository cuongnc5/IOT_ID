# browser-polyfills
Minimal polyfills for modern browser applications

# What does it have
This polyfill contains the following polyfills:
 - `Promise`
 - `fetch`
 - `Map`
 - `Set`
 - `Array.find`
 - `Array.findIndex`
 - `Array.from`
 - `Object.values`
 - `Object.assign`
 - `requestAnimationFrame` (`rAF`)

# How to use
Just import it at the beginning of your application and go wild.
```javascript
import 'browser-polyfills';
```
Note that this package will only polyfill what your browser environment does not
have. For example, if the user's browser has `fetch`, this package will not add
the polyfill and your application will keep using the browser's native code.

# Enhancements
This package fine-tunes some aspects of the polyfilled packages. Note that the
enhancements described here are done in spite of the browser's support (i.e.
if `fetch` is supported by the browser, the enhancement will still be applied).

## `fetch`
Both native and polyfilled `fetch` functions have a major inconsistency related
to the function's outcome. Basically `fetch` can either return a `Promise` when
successfully communicates with the server, or throws an error when it cannot.
This inconsistency can easily lead to repeated or bloated code and/or unhandled
errors. This package prevents this inconsistency and forces `fetch` to always
return a `Promise`. I.e. instead of throwing an error, `fetch` will return a
rejected `Promise`, to be handled like any `Promise` would - with a `catch`.
