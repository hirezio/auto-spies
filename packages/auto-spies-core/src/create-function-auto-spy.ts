import {
  addPromiseHelpersToFunctionSpy,
  addObservableHelpersToFunctionSpy,
  addPromiseHelpersToCalledWithObject,
  addObservableHelpersToCalledWithObject,
  Func,
  WrappedValueConfigPerCall,
} from '.';
import deepEqual from 'deep-equal';
import { errorHandler } from './errors/error-handler';
import { Subject } from 'rxjs';

export interface CalledWithObject {
  wasConfigured: boolean;
  argsToValuesMap: Map<any, any>;
  resolveWith?: (value?: any) => void;
  rejectWith?: (value?: any) => void;
  nextWith?(value?: any): void;
  nextOneTimeWith?(value?: any): void;
  throwWith?(value: any): void;
  complete?(): void;
  returnSubject?<R = any>(): Subject<R>;
}

export interface FunctionSpyReturnValueContainer {
  value: any;
  _isRejectedPromise?: boolean;
  valuesPerCalls?: WrappedValueConfigPerCall[];
}

export type CalledWithFrameworkMethodsDecorator<FrameworkSpecificType> = (
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
) => CalledWithObject & FrameworkSpecificType;

export type FunctionSpyFactory = (
  functionName: string,
  spyFunctionImplementation: Func
) => {
  functionSpy: any;
  objectToAddSpyMethodsTo: any;
};

export function createFunctionAutoSpy<ReturnType, LibSpecificType>(
  functionName: string,
  addFrameworkMethodsToCalledWithObject: CalledWithFrameworkMethodsDecorator<
    LibSpecificType
  >,
  frameworkFunctionSpyFactory: FunctionSpyFactory
): ReturnType {
  const calledWithObject: CalledWithObject = {
    wasConfigured: false,
    argsToValuesMap: new Map(),
  };

  const mustBeCalledWithObject: CalledWithObject = {
    wasConfigured: false,
    argsToValuesMap: new Map(),
  };

  const valueContainer: FunctionSpyReturnValueContainer = {
    value: undefined,
  };

  // Function to pass to the specific testing library to call
  // whenever someone calls the spied on method
  function spyFunctionImpl(...actualArgs: any[]) {
    // >>> Add "per call" logic here

    return returnTheCorrectFakeValue(
      calledWithObject,
      mustBeCalledWithObject,
      valueContainer,
      actualArgs,
      functionName
    );
  }

  const { functionSpy, objectToAddSpyMethodsTo } = frameworkFunctionSpyFactory(
    functionName,
    spyFunctionImpl
  );

  addPromiseHelpersToFunctionSpy(objectToAddSpyMethodsTo, valueContainer);
  addObservableHelpersToFunctionSpy(objectToAddSpyMethodsTo, valueContainer);

  functionSpy.calledWith = (...calledWithArgs: any[]) => {
    return addMethodsToCalledWith(
      calledWithObject,
      calledWithArgs,
      addFrameworkMethodsToCalledWithObject
    );
  };

  functionSpy.mustBeCalledWith = (...calledWithArgs: any[]) => {
    return addMethodsToCalledWith(
      mustBeCalledWithObject,
      calledWithArgs,
      addFrameworkMethodsToCalledWithObject
    );
  };

  return functionSpy;
}

function addMethodsToCalledWith<LibSpecificType>(
  calledWith: CalledWithObject,
  calledWithArgs: any[],
  addFrameworkMethodsToCalledWithObject: CalledWithFrameworkMethodsDecorator<
    LibSpecificType
  >
): CalledWithObject {
  calledWith.wasConfigured = true;
  calledWith = addFrameworkMethodsToCalledWithObject(calledWith, calledWithArgs);
  calledWith = addPromiseHelpersToCalledWithObject(calledWith, calledWithArgs);
  calledWith = addObservableHelpersToCalledWithObject(calledWith, calledWithArgs);
  return calledWith;
}

function returnTheCorrectFakeValue(
  calledWithObject: CalledWithObject,
  mustBeCalledWithObject: CalledWithObject,
  valueContainer: FunctionSpyReturnValueContainer,
  actualArgs: any[],
  functionName: string
) {
  if (calledWithObject.wasConfigured) {
    for (const storedCalledWithArgs of calledWithObject.argsToValuesMap.keys()) {
      if (deepEqual(storedCalledWithArgs, actualArgs)) {
        const expectedReturnValue = calledWithObject.argsToValuesMap.get(
          storedCalledWithArgs
        );
        if (expectedReturnValue && expectedReturnValue._isRejectedPromise) {
          return Promise.reject(expectedReturnValue.value);
        }
        return expectedReturnValue;
      }
    }
  }
  if (mustBeCalledWithObject.wasConfigured) {
    for (const storedCalledWithArgs of mustBeCalledWithObject.argsToValuesMap.keys()) {
      if (deepEqual(storedCalledWithArgs, actualArgs)) {
        const expectedReturnValue = mustBeCalledWithObject.argsToValuesMap.get(
          storedCalledWithArgs
        );
        if (expectedReturnValue._isRejectedPromise) {
          return Promise.reject(expectedReturnValue.value);
        }
        return expectedReturnValue;
      }
    }
    errorHandler.throwArgumentsError(actualArgs, functionName);
  }

  if (valueContainer._isRejectedPromise) {
    return Promise.reject(valueContainer.value);
  }

  if (valueContainer.valuesPerCalls?.length) {
    const wrappedValueConfigForNextCall = valueContainer.valuesPerCalls.shift();
    let returnedValue = wrappedValueConfigForNextCall?.wrappedValue;
    if (wrappedValueConfigForNextCall?.delay) {
      // if it has a delay at this point, it must be a promise
      returnedValue = (returnedValue as Promise<any>).then(
        (value) =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(value);
            }, wrappedValueConfigForNextCall.delay);
          })
      );
    }
    return returnedValue;
  }

  return valueContainer.value;
}
