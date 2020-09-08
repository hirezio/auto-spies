import { ReplaySubject } from 'rxjs';
import {
  FunctionSpyReturnValueContainer,
  CalledWithObject,
  AddObservableSpyMethods,
} from '..';

export function addObservableHelpersToFunctionSpy(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  spyFunction: any,
  valueContainer: FunctionSpyReturnValueContainer
): void {
  const subject: ReplaySubject<any> = new ReplaySubject(1);

  spyFunction.nextWith = function nextWith(value: any) {
    valueContainer.value = subject;
    subject.next(value);
  };

  spyFunction.nextOneTimeWith = function nextOneTimeWith(value: any) {
    valueContainer.value = subject;
    subject.next(value);
    subject.complete();
  };

  spyFunction.throwWith = function throwWith(value: any) {
    valueContainer.value = subject;
    subject.error(value);
  };

  spyFunction.complete = function complete() {
    valueContainer.value = subject;
    subject.complete();
  };

  spyFunction.returnSubject = function complete() {
    valueContainer.value = subject;
    return subject;
  };
}

export function addObservableHelpersToCalledWithObject(
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
): CalledWithObject {
  const subject: ReplaySubject<any> = new ReplaySubject(1);

  calledWithObject.nextWith = function (value: any) {
    subject.next(value);
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.nextOneTimeWith = function (value: any) {
    subject.next(value);
    subject.complete();
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.throwWith = function (value: any) {
    subject.error(value);
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.complete = function () {
    subject.complete();
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.returnSubject = function () {
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
    return subject;
  };

  return calledWithObject;
}

export function createObservablePropSpy<T>(): T & AddObservableSpyMethods<T> {
  const subject: ReplaySubject<any> = new ReplaySubject();

  const observableSpy: any = subject.asObservable();

  observableSpy.nextWith = function nextWith(value: any) {
    subject.next(value);
  };
  observableSpy.nextOneTimeWith = function nextOneTimeWith(value: any) {
    subject.next(value);
    subject.complete();
  };
  observableSpy.throwWith = function throwWith(value: any) {
    subject.error(value);
  };
  observableSpy.complete = function complete() {
    subject.complete();
  };
  observableSpy.returnSubject = function returnSubject() {
    return subject;
  };

  return observableSpy;
}
