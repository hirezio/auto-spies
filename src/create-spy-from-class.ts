import { AsyncSpyFunction, Spy } from './spy-types';
import deepEqual from 'deep-equal';
import { throwArgumentsError } from './error-handling';
import { Observable, ReplaySubject } from 'rxjs';

import root from 'window-or-global';

const Reflect = root.Reflect;

export function createSpyFromClass<T>(
  ObjectClass: { new (...args: any[]): T; [key: string]: any },
  providedPromiseMethodNames?: string[],
  providedObservableMethodNames?: string[]
): Spy<T> {
  const proto = ObjectClass.prototype;
  const methodNames = getAllMethodNames(proto);

  const autoSpy: any = {};

  methodNames.forEach(methodName => {
    const returnTypeClass = Reflect.getMetadata('design:returntype', proto, methodName);

    const spyMethod = createSpyFunction(methodName);

    if (
      doesMethodReturnPromise(providedPromiseMethodNames, methodName, returnTypeClass )
    ) {
      autoSpy[methodName] = createPromiseSpyFunction(spyMethod);
    } else if (
      doesMethodReturnObservable(providedObservableMethodNames, methodName, returnTypeClass)
    ) {
      autoSpy[methodName] = createObservableSpyFunction(spyMethod);
    } else {
      autoSpy[methodName] = spyMethod;
    }
  });
  return autoSpy as Spy<T>;
}

function createObservableSpyFunction(spyFunction: any): AsyncSpyFunction {
  const subject: ReplaySubject<any> = new ReplaySubject(1);

  spyFunction.and.returnValue(subject);
  spyFunction.and.nextWith = function nextWith(value: any) {
    subject.next(value);
  };

  spyFunction.and.nextOneTimeWith = function nextOneTimeWith(value: any) {
    subject.next(value);
    subject.complete();
  };

  spyFunction.and.nextWithError = function nextWithError(value: any) {
    subject.error(value);
  };

  spyFunction.and.complete = function complete() {
    subject.complete();
  };

  spyFunction.calledWith = (...calledWithArgs: any[]) => {
    return {
      nextWith(value: any) {
        spyFunction.and.callFake((...actualArgs: any[]) => {
          if (!deepEqual(calledWithArgs, actualArgs)) {
            throwArgumentsError(calledWithArgs, actualArgs);
          }
          subject.next(value);
          return subject;
        });
      },
      nextOneTimeWith(value: any) {
        spyFunction.and.callFake((...actualArgs: any[]) => {
          if (!deepEqual(calledWithArgs, actualArgs)) {
            throwArgumentsError(calledWithArgs, actualArgs);
          }
          subject.next(value);
          subject.complete();
          return subject;
        });
      },
      nextWithError(value: any) {
        spyFunction.and.callFake((...actualArgs: any[]) => {
          if (!deepEqual(calledWithArgs, actualArgs)) {
            throwArgumentsError(calledWithArgs, actualArgs);
          }
          subject.error(value);
          return subject;
        });
      },
      complete() {
        spyFunction.and.callFake((...actualArgs: any[]) => {
          if (!deepEqual(calledWithArgs, actualArgs)) {
            throwArgumentsError(calledWithArgs, actualArgs);
          }
          subject.complete();
          return subject;
        });
      }
    };
  };

  return spyFunction as AsyncSpyFunction;
}

function createPromiseSpyFunction(spyFunction: any): AsyncSpyFunction {
  spyFunction.and.returnValue(
    new Promise<any>((resolveWith, rejectWith) => {
      spyFunction.and.resolveWith = resolveWith;
      spyFunction.and.rejectWith = rejectWith;
    })
  );

  spyFunction.calledWith = (...calledWithArgs: any[]) => {
    return {
      resolveWith(value?: any) {
        spyFunction.and.callFake((...actualArgs: any[]) => {
          if (!deepEqual(calledWithArgs, actualArgs)) {
            throwArgumentsError(calledWithArgs, actualArgs);
          }
          return Promise.resolve(value);
        });
      },
      rejectWith(value?: any) {
        spyFunction.and.callFake((...actualArgs: any[]) => {
          if (!deepEqual(calledWithArgs, actualArgs)) {
            throwArgumentsError(calledWithArgs, actualArgs);
          }
          return Promise.reject(value);
        });
      }
    };
  };

  return spyFunction as AsyncSpyFunction;
}

function createSpyFunction(name: string) {
  const spyFunction: any = jasmine.createSpy(name);

  spyFunction.calledWith = (...calledWithArgs: any[]) => {
    return {
      returnValue(value: any) {
        spyFunction.and.callFake((...actualArgs: any[]) => {
          if (!deepEqual(calledWithArgs, actualArgs)) {
            throwArgumentsError(calledWithArgs, actualArgs);
          }
          return value;
        });
      }
    };
  };
  return spyFunction;
}

function doesMethodReturnPromise(
  promiseMethodsList: string[],
  methodName: string,
  returnTypeClass: any
): boolean {
  return (
    (promiseMethodsList && promiseMethodsList.indexOf(methodName) !== -1) ||
    returnTypeClass === Promise
  );
}

function doesMethodReturnObservable(
  observableMethodsList: string[],
  methodName: string,
  returnTypeClass: any
): boolean {
  return (
    (observableMethodsList &&
      observableMethodsList.indexOf(methodName) !== -1) ||
    returnTypeClass === Observable ||
    (returnTypeClass && returnTypeClass.prototype instanceof Observable)
  );
}


function getAllMethodNames(obj: any) {
  let methods: string[] = [];

  do {
    methods = methods.concat(Object.getOwnPropertyNames(obj));
    obj = Object.getPrototypeOf(obj);
  } while (obj);

  const constructorIndex = methods.indexOf('constructor');
  if (constructorIndex >= 0) {
    methods.splice(constructorIndex, 1);
  }

  // .filter(methodName => typeof proto[methodName] == 'function')
  return methods;
}
