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
  const methodNames = getAllMethodNames(proto);
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
    wasCalled: false,
    argsToValuesMap: new Map()
  };

  let mustBeCalledWithObject: CalledWithObject = {
    wasCalled: false,
    argsToValuesMap: new Map()
  };

  const valueContainer: SpyFunctionReturnValueContainer = {
    value: undefined
  };

  promisifySpyFunction(spyFunction, valueContainer);
  observablifySpyFunction(spyFunction, valueContainer);

  spyFunction.and.callFake((...actualArgs: any[]) => {
    return spyFunctionImplementation(
      calledWithObject,
      mustBeCalledWithObject,
      valueContainer,
      actualArgs
    );
  });

  spyFunction.calledWith = (...calledWithArgs: any[]) => {
    calledWithObject.wasCalled = true;
    calledWithObject = addSyncHandlingToCalledWith(calledWithObject, calledWithArgs);
    calledWithObject = addPromiseHandlingToCalledWith(calledWithObject, calledWithArgs);
    calledWithObject = addObservableHandlingToCalledWith(
      calledWithObject,
      calledWithArgs
    );
    return calledWithObject;
  };

  spyFunction.mustBeCalledWith = (...calledWithArgs: any[]) => {
    mustBeCalledWithObject.wasCalled = true;
    mustBeCalledWithObject = addSyncHandlingToCalledWith(
      mustBeCalledWithObject,
      calledWithArgs
    );
    mustBeCalledWithObject = addPromiseHandlingToCalledWith(
      mustBeCalledWithObject,
      calledWithArgs
    );
    mustBeCalledWithObject = addObservableHandlingToCalledWith(
      mustBeCalledWithObject,
      calledWithArgs
    );
    return mustBeCalledWithObject;
  };

  return spyFunction;
}

function spyFunctionImplementation(
  calledWithObject: CalledWithObject,
  mustBeCalledWithObject: CalledWithObject,
  valueContainer: SpyFunctionReturnValueContainer,
  actualArgs: any[]
) {
  if (calledWithObject.wasCalled) {
    for (const storedCalledWithArgs of calledWithObject.argsToValuesMap.keys()) {
      if (deepEqual(storedCalledWithArgs, actualArgs)) {
        return calledWithObject.argsToValuesMap.get(storedCalledWithArgs);
      }
    }
  }
  if (mustBeCalledWithObject.wasCalled) {
    for (const storedCalledWithArgs of mustBeCalledWithObject.argsToValuesMap.keys()) {
      if (deepEqual(storedCalledWithArgs, actualArgs)) {
        return mustBeCalledWithObject.argsToValuesMap.get(storedCalledWithArgs);
      }
    }
    throwArgumentsError(actualArgs);
  }
  return valueContainer.value;
}

function addSyncHandlingToCalledWith(
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
): CalledWithObject {
  calledWithObject.returnValue = (value: any) => {
    calledWithObject.argsToValuesMap.set(calledWithArgs, value);
  };
  return calledWithObject;
}

function getAllMethodNames(obj: any): string[] {
  let methods: string[] = [];

  do {
    methods = methods.concat(Object.getOwnPropertyNames(obj));
    obj = Object.getPrototypeOf(obj);
  } while (obj);

  const constructorIndex = methods.indexOf('constructor');
  if (constructorIndex >= 0) {
    methods.splice(constructorIndex, 1);
  }
  return methods;
}
