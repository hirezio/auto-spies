import { Spy, AddSpyTypes } from './spy.types';
import deepEqual from 'deep-equal';
import { throwArgumentsError } from './errors/error-handling';
import {
  addObservableHelpersToFunctionSpy,
  addObservableHelpersToCalledWithObject
} from './observables/observable-spy-utils';

import {
  addPromiseHelpersToFunctionSpy,
  addPromiseHelpersToCalledWithObject
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
    autoSpy[methodName] = createFunctionSpy(methodName);
  });
  return autoSpy as Spy<T>;
}

export function createFunctionSpy<MT>(name: string): AddSpyTypes<MT> {
  const functionSpy: any = jasmine.createSpy(name);

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

  addPromiseHelpersToFunctionSpy(functionSpy, valueContainer);
  addObservableHelpersToFunctionSpy(functionSpy, valueContainer);

  functionSpy.and.callFake((...actualArgs: any[]) => {
    return spyFunctionImplementation(
      calledWithObject,
      mustBeCalledWithObject,
      valueContainer,
      actualArgs
    );
  });

  functionSpy.calledWith = (...calledWithArgs: any[]) => {
    calledWithObject.wasCalled = true;
    calledWithObject = addSyncHandlingToCalledWithObject(
      calledWithObject,
      calledWithArgs
    );
    calledWithObject = addPromiseHelpersToCalledWithObject(
      calledWithObject,
      calledWithArgs
    );
    calledWithObject = addObservableHelpersToCalledWithObject(
      calledWithObject,
      calledWithArgs
    );
    return calledWithObject;
  };

  functionSpy.mustBeCalledWith = (...calledWithArgs: any[]) => {
    mustBeCalledWithObject.wasCalled = true;
    mustBeCalledWithObject = addSyncHandlingToCalledWithObject(
      mustBeCalledWithObject,
      calledWithArgs
    );
    mustBeCalledWithObject = addPromiseHelpersToCalledWithObject(
      mustBeCalledWithObject,
      calledWithArgs
    );
    mustBeCalledWithObject = addObservableHelpersToCalledWithObject(
      mustBeCalledWithObject,
      calledWithArgs
    );
    return mustBeCalledWithObject;
  };

  return functionSpy;
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

function addSyncHandlingToCalledWithObject(
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
