import {
  addPromiseHelpersToFunctionSpy,
  addObservableHelpersToFunctionSpy,
  addPromiseHelpersToCalledWithObject,
  addObservableHelpersToCalledWithObject,
  Func,
  WrappedValueConfigPerCall,
  ValueConfigPerCall,
  ValueConfig,
} from '.';
import { errorHandler } from './errors/error-handler';
import { Subject } from 'rxjs';
import { ArgsMap } from './args-map';

export interface CalledWithObject {
  wasConfigured: boolean;
  argsToValuesMap: ArgsMap;
  resolveWith?: (value?: any) => void;
  resolveWithPerCall?<T = any>(valuesPerCall?: ValueConfigPerCall<T>[]): void;
  rejectWith?: (value?: any) => void;
  nextWith?(value?: any): void;
  nextOneTimeWith?(value?: any): void;
  nextWithValues?<T = any>(valuesConfigs: ValueConfig<T>[]): void;
  nextWithPerCall?<T = any>(valuesPerCall?: ValueConfigPerCall<T>[]): Subject<T>[];
  throwWith?(value: any): void;
  complete?(): void;
  returnSubject?<R = any>(): Subject<R>;
}

export interface ReturnValueContainer {
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
    argsToValuesMap: new ArgsMap(),
  };

  const mustBeCalledWithObject: CalledWithObject = {
    wasConfigured: false,
    argsToValuesMap: new ArgsMap(),
  };

  const valueContainer: ReturnValueContainer = {
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
  valueContainer: ReturnValueContainer,
  actualArgs: any[],
  functionName: string
) {
  if (calledWithObject.wasConfigured) {
    const expectedReturnValueContainer = calledWithObject.argsToValuesMap.get(actualArgs);

    /* istanbul ignore else */
    if (expectedReturnValueContainer) {
      if (expectedReturnValueContainer._isRejectedPromise) {
        return Promise.reject(expectedReturnValueContainer.value);
      }
      if (expectedReturnValueContainer.valuesPerCalls?.length) {
        return getNextCallValue(expectedReturnValueContainer);
      }

      return expectedReturnValueContainer.value;
    }
  }

  if (mustBeCalledWithObject.wasConfigured) {
    const expectedReturnValueContainer = mustBeCalledWithObject.argsToValuesMap.get(
      actualArgs
    );
    /* istanbul ignore else */
    if (expectedReturnValueContainer) {
      if (expectedReturnValueContainer._isRejectedPromise) {
        return Promise.reject(expectedReturnValueContainer.value);
      }
      if (expectedReturnValueContainer.valuesPerCalls?.length) {
        return getNextCallValue(expectedReturnValueContainer);
      }

      return expectedReturnValueContainer.value;
    }
    errorHandler.throwArgumentsError(actualArgs, functionName);
  }

  if (valueContainer._isRejectedPromise) {
    return Promise.reject(valueContainer.value);
  }

  if (valueContainer.valuesPerCalls?.length) {
    return getNextCallValue(valueContainer);
  }

  return valueContainer.value;
}

function getNextCallValue(valueContainer: ReturnValueContainer): any {
  /* istanbul ignore next */
  if (valueContainer.valuesPerCalls?.length) {
    const wrappedValueConfigForNextCall = valueContainer.valuesPerCalls.shift();
    /* istanbul ignore next */
    let returnedValue = wrappedValueConfigForNextCall?.wrappedValue;

    /* istanbul ignore else */
    if (wrappedValueConfigForNextCall && wrappedValueConfigForNextCall.delay) {
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
}
