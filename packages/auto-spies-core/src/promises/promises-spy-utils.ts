import { ReturnValueContainer, CalledWithObject, ValueConfigPerCall } from '../';

export function addPromiseHelpersToFunctionSpy(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  spyFunction: any,
  valueContainer: ReturnValueContainer
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

        /* istanbul ignore else */
        if (valueContainer.valuesPerCalls) {
          valueContainer.valuesPerCalls.push({
            wrappedValue: returnedPromise,
            delay: valueConfiguration.delay,
          });
        }
      });
    }
  };
}

export function addPromiseHelpersToCalledWithObject(
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
): CalledWithObject {
  let valueContainer: ReturnValueContainer;

  calledWithObject.resolveWith = function (value?: any) {
    calledWithObject.argsToValuesMap.set(calledWithArgs, Promise.resolve(value));
    valueContainer = {
      value: Promise.resolve(value),
    };
    calledWithObject.argsToValuesMap.set(calledWithArgs, valueContainer);
  };
  calledWithObject.rejectWith = function (value?: any) {
    valueContainer = {
      value,
      _isRejectedPromise: true,
    };
    calledWithObject.argsToValuesMap.set(calledWithArgs, valueContainer);
  };

  calledWithObject.resolveWithPerCall = function resolveWithPerCall<T>(
    valueConfigsPerCall: ValueConfigPerCall<T>[]
  ) {
    valueContainer = { value: undefined };
    /* istanbul ignore else */
    if (valueConfigsPerCall && valueConfigsPerCall.length > 0) {
      valueContainer.valuesPerCalls = [];

      let returnedPromise: Promise<T>;

      valueConfigsPerCall.forEach((valueConfiguration) => {
        returnedPromise = Promise.resolve(valueConfiguration.value);

        /* istanbul ignore else */
        if (valueContainer.valuesPerCalls) {
          valueContainer.valuesPerCalls.push({
            wrappedValue: returnedPromise,
            delay: valueConfiguration.delay,
          });
        }
      });
      calledWithObject.argsToValuesMap.set(calledWithArgs, valueContainer);
    }
  };

  return calledWithObject;
}
