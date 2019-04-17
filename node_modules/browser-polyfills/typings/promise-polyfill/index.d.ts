
declare module 'promise-polyfill/src/polyfill' {
  interface Thenable<T> {
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
  }

  class Promise<T> implements Thenable<T> {
    static _immediateFn: Function | undefined;

    constructor(callback: (resolve : (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void);

    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Promise<U>;

    catch<U>(onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
  }

  let localPromise: typeof Promise;

  export = localPromise;
}
