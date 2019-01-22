import { ObservableMethodKey, PromiseMethodKey, Spy } from './spy-types';
import deepEqual from 'deep-equal';
import { throwArgumentsError } from './error-handling';
import { Observable, ReplaySubject } from 'rxjs';

import root from 'window-or-global';

const Reflect = root.Reflect;

export function createSpyFromClass<T>(
  ObjectClass: { new (...args: any[]): T; [key: string]: any },
  providedPromiseMethodKeys?: Array<PromiseMethodKey<T>>,
  providedObservableMethodKeys?: Array<ObservableMethodKey<T>>
): Spy<T> {
  const proto = ObjectClass.prototype;
  const methodNames = getAllMethodNames(proto);

  const promiseMethodKeys: Array<string | number | symbol> =
    providedPromiseMethodKeys || [];
  const observableMethodKeys: Array<string | number | symbol> =
    providedObservableMethodKeys || [];

  const autoSpy: any = {};

  methodNames.forEach(methodName => {
    const returnTypeClass = Reflect.getMetadata(
      'design:returntype',
      proto,
      methodName
    );

    const spyMethod = createSpyFunction(methodName);

    if (
      promiseMethodKeys.indexOf(methodName) !== -1 ||
      returnTypeClass === Promise
    ) {
      autoSpy[methodName] = createPromiseSpyFunction(spyMethod);
    } else if (
      observableMethodKeys.indexOf(methodName) !== -1 ||
      returnTypeClass === Observable
    ) {
      autoSpy[methodName] = createObservableSpyFunction(spyMethod);
    } else {
      autoSpy[methodName] = spyMethod;
    }
  });
  return autoSpy as Spy<T>;
}

function createObservableSpyFunction(spyFunction: any) {
  const subject: ReplaySubject<any> = new ReplaySubject(1);

  spyFunction.and.returnValue(subject);
  spyFunction.and.nextWith = function nextWith(value: any) {
    subject.next(value);
  };

  spyFunction.and.nextOneTimeWith = function nextOneTimeWith(value: any) {
    subject.next(value);
    subject.complete();
  };

  spyFunction.and.throwWith = function throwWith(value: any) {
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
      throwWith(value: any) {
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

  return spyFunction;
}

function createPromiseSpyFunction(spyFunction: any) {
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

  return spyFunction;
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

function getAllMethodNames(obj: any): string[] {
  let methods: string[] = [];

  do {
    methods = methods.concat(Object.keys(obj));
    obj = Object.getPrototypeOf(obj);
  } while (obj);

  const constructorIndex = methods.indexOf('constructor');
  if (constructorIndex >= 0) {
    methods.splice(constructorIndex, 1);
  }

  // .filter(methodName => typeof proto[methodName] == 'function')
  return methods;
}
