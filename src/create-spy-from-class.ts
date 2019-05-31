import { Spy } from './spy.types';
import deepEqual from 'deep-equal';
import { throwArgumentsError } from './errors/error-handling';
import {
  observablifySpyFunction,
  addObservableHandlingToCalledWith
} from './observables/observable-spy-utils';

import {
  promisifySpyFunction,
  addPromiseHandlingToCalledWith
} from './promises/promises-spy-utils';
import {
  CalledWithObject,
  SpyFunctionReturnValueContainer
} from './create-spy-from-class.types';

export function createSpyFromClass<T>(
  ObjectClass: { new (...args: any[]): T; [key: string]: any },
  providedMethodNames?: string[]
): Spy<T> {
  const proto = ObjectClass.prototype;
  let methodNames = getAllMethodNames(proto);
  if (providedMethodNames && providedMethodNames.length > 0) {
    methodNames.push(...providedMethodNames);
  }

  const autoSpy: any = {};

  methodNames.forEach(methodName => {
    autoSpy[methodName] = createSpyFunction(methodName);
  });
  return autoSpy as Spy<T>;
}

function createSpyFunction(name: string) {
  const spyFunction: any = jasmine.createSpy(name);

  let calledWithObject: CalledWithObject = {
    calledWithMethodWasCalled: false,
    shouldThrow: false,
    calledWithMap: new Map()
  };

  let valueContainer: SpyFunctionReturnValueContainer = {
    value: undefined
  };

  promisifySpyFunction(spyFunction, valueContainer);
  observablifySpyFunction(spyFunction, valueContainer);

  spyFunction.and.callFake((...actualArgs: any[]) => {
    return spyFunctionCallFakeImplementation(
      calledWithObject,
      valueContainer,
      actualArgs
    );
  });

  spyFunction.calledWith = (...calledWithArgs: any[]) => {
    calledWithObject.calledWithMethodWasCalled = true;
    calledWithObject = addSyncHandlingToCalledWith(calledWithObject, calledWithArgs);
    calledWithObject = addPromiseHandlingToCalledWith(calledWithObject, calledWithArgs);
    calledWithObject = addObservableHandlingToCalledWith(
      calledWithObject,
      calledWithArgs
    );
    return calledWithObject;
  };

  return spyFunction;
}

function spyFunctionCallFakeImplementation(
  calledWithObject: CalledWithObject,
  valueContainer: SpyFunctionReturnValueContainer,
  actualArgs: any[]
) {
  if (calledWithObject.calledWithMethodWasCalled) {
    for (let storedCalledWithArgs of calledWithObject.calledWithMap.keys()) {
      if (deepEqual(storedCalledWithArgs, actualArgs)) {
        return calledWithObject.calledWithMap.get(storedCalledWithArgs);
      }
    }
    if (calledWithObject.shouldThrow) {
      throwArgumentsError(actualArgs);
    }
  }
  return valueContainer.value;
}

function addSyncHandlingToCalledWith(
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
): CalledWithObject {
  calledWithObject.returnValue = (value: any) => {
    calledWithObject.calledWithMap.set(calledWithArgs, value);

    return {
      throwOnMismatch() {
        calledWithObject.shouldThrow = true;
      }
    };
  };
  return calledWithObject;
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
  return methods;
}
