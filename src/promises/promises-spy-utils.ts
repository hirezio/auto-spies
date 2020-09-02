import {
  FunctionSpyReturnValueContainer,
  CalledWithObject,
} from '../create-spy-from-class.types';

export function addPromiseHelpersToFunctionSpy(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  spyFunction: any,
  valueContainer: FunctionSpyReturnValueContainer
): void {
  spyFunction.and.resolveWith = function (value?: any) {
    valueContainer.value = Promise.resolve(value);
  };
  spyFunction.and.rejectWith = function (value?: any) {
    valueContainer.value = value;
    valueContainer._isRejectedPromise = true;
  };
}

export function addPromiseHelpersToCalledWithObject(
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
): CalledWithObject {
  calledWithObject.resolveWith = function (value?: any) {
    calledWithObject.argsToValuesMap.set(calledWithArgs, Promise.resolve(value));
  };
  calledWithObject.rejectWith = function (value?: any) {
    const valueContainer: FunctionSpyReturnValueContainer = {
      value,
      _isRejectedPromise: true,
    };
    calledWithObject.argsToValuesMap.set(calledWithArgs, valueContainer);
  };
  return calledWithObject;
}
