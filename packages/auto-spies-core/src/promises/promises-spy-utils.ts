import {
  FunctionSpyReturnValueContainer,
  CalledWithObject,
  ValueConfigPerCall,
} from '../';

export function addPromiseHelpersToFunctionSpy(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  spyFunction: any,
  valueContainer: FunctionSpyReturnValueContainer
): void {
  spyFunction.resolveWith = function (value?: any) {
    valueContainer.value = Promise.resolve(value);
  };
  spyFunction.rejectWith = function (value?: any) {
    valueContainer.value = value;
    valueContainer._isRejectedPromise = true;
  };

  spyFunction.resolveWithPerCall = function resolveWithPerCall<T>(
    valueConfigsPerCall: ValueConfigPerCall<T>[]
  ) {
    /* istanbul ignore else */
    if (valueConfigsPerCall && valueConfigsPerCall.length > 0) {
      valueContainer.valuesPerCalls = [];

      let returnedPromise: Promise<T>;

      valueConfigsPerCall.forEach((valueConfiguration) => {
        returnedPromise = Promise.resolve(valueConfiguration.value);
        if (valueConfiguration.delay) {
          returnedPromise = new Promise((resolve) => {
            setTimeout(() => {
              resolve(valueConfiguration.value);
            }, valueConfiguration.delay);
          });
        }
        /* istanbul ignore else */
        if (valueContainer.valuesPerCalls) {
          valueContainer.valuesPerCalls.push(returnedPromise);
        }
      });
    }
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
