import { Spy, AddSpyTypes, MethodName, DescriptedMethod } from './spy.types';
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
  const { methods, getters, setters } = getAllMethodNames(proto);
  if (providedMethodNames && providedMethodNames.length > 0) {
    methods.push(...providedMethodNames);
  }

  const autoSpy: any = {};
  getters.forEach(getter => {
    // Create a getter property with 'get' access type
    Object.defineProperty(autoSpy, getter, {
      get: (): any => {},
      configurable: true
    });
    // Because spyOnProperty accept the object itself
    // you need to spy this property in your own test code
    // spyOnProperty(yourSpiedObject, 'yourGetter', 'get');
  });
  setters.forEach(setter => {
    // Create a setter property with 'set' access type
    Object.defineProperty(autoSpy, setter, {
      set: (_): any => {},
      configurable: true
    });
    // Because spyOnProperty accept the object itself
    // you need to spy this property in your own test code
    // spyOnProperty(yourSpiedObject, 'yourSetter', 'set');
  });
  methods.forEach(methodName => {
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

export function getAllMethodNames(obj: any): MethodName {
  let m;
  let descriptedMethods: DescriptedMethod[] = [];
  do {
    m = Object.getOwnPropertyNames(obj);
    descriptedMethods = [
      ...descriptedMethods,
      ...m
        .map(propName => {
          return {
            propertyName: propName,
            descriptor: Object.getOwnPropertyDescriptor(obj, propName)
          };
        })
        .filter(descMethod => descMethod.descriptor !== undefined)
    ] as DescriptedMethod[];
    obj = Object.getPrototypeOf(obj);
  } while (obj);

  const methods = descriptedMethods
    .filter(
      dm => dm.descriptor['get'] === undefined && dm.descriptor['set'] === undefined
    )
    .map(dm => dm.propertyName)
    .filter(method => method !== 'constructor');
  const getters = descriptedMethods
    .filter(dm => dm.descriptor['get'] !== undefined)
    .filter(dm => dm.propertyName !== '__proto__')
    .map(dm => dm.propertyName);
  const setters = descriptedMethods
    .filter(dm => dm.descriptor['set'] !== undefined)
    .filter(dm => dm.propertyName !== '__proto__')
    .map(dm => dm.propertyName);
  return {
    methods,
    getters,
    setters
  };
}
