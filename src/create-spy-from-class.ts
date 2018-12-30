import { AsyncSpyFunction, Spy } from './spy-types';

import { Observable, ReplaySubject } from 'rxjs';

declare var window: any;

const Reflect = window['Reflect'];

export function createSpyFromClass<T>(
  ObjectClass: { new (...args: any[]): T, [key: string]: any; },
  providedPromiseMethodNames?: string[],
  providedObservableMethodNames?: string[]): Spy<T> {

  const proto = ObjectClass.prototype;
  const methodNames = getAllMethodNames(proto);

  const autoSpy: any = {};

  methodNames.forEach((methodName) => {
    const returnTypeClass = Reflect.getMetadata('design:returntype', proto, methodName);

    if ((providedPromiseMethodNames &&
      providedPromiseMethodNames.indexOf(methodName) !== -1) ||
      returnTypeClass === Promise) {

      autoSpy[methodName] = createPromiseSpyFunction(methodName);

    } else if ((providedObservableMethodNames &&
      providedObservableMethodNames.indexOf(methodName) !== -1) ||
      returnTypeClass === Observable) {

      autoSpy[methodName] = createObservableSpyFunction(methodName);
    } else {
      autoSpy[methodName] = jasmine.createSpy(methodName);
    }
  });
  return autoSpy as Spy<T>;
}

function createObservableSpyFunction(name: string): AsyncSpyFunction {
  const spyFunction: any = jasmine.createSpy(name);
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

  return spyFunction as AsyncSpyFunction;

}

function createPromiseSpyFunction(name: string): AsyncSpyFunction {
  const spyFunction: any = jasmine.createSpy(name);

  spyFunction.and.returnValue(new Promise<any>((resolveWith, rejectWith) => {
    spyFunction.and.resolveWith = resolveWith;
    spyFunction.and.rejectWith = rejectWith;
  }));

  return spyFunction as AsyncSpyFunction;
}

function getAllMethodNames(obj: any) {
  let methods: string[] = [];

  do {
    methods = methods.concat(Object.keys((obj)));
    obj = Object.getPrototypeOf(obj);
  } while (obj);

  const constructorIndex = methods.indexOf('constructor');
  if (constructorIndex >= 0) {
    methods.splice(constructorIndex, 1);
  }

  // .filter(methodName => typeof proto[methodName] == 'function')
  return methods;

}
