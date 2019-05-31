import { throwArgumentsError } from '../errors/error-handling';
import deepEqual from 'deep-equal';
import {
  SpyFunctionReturnValueContainer,
  CalledWithObject
} from '../create-spy-from-class.types';

export function promisifySpyFunction(
  spyFunction: any,
  valueContainer: SpyFunctionReturnValueContainer
) {
  spyFunction.and.resolveWith = function(value?: any) {
    valueContainer.value = Promise.resolve(value);
  };
  spyFunction.and.rejectWith = function(value?: any) {
    valueContainer.value = Promise.reject(value);
  };
}

export function addPromiseHandlingToCalledWith(
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
): CalledWithObject {
  calledWithObject.resolveWith = function(value?: any) {
    calledWithObject.calledWithMap.set(calledWithArgs, Promise.resolve(value));
    return {
      throwOnMismatch() {
        calledWithObject.shouldThrow = true;
      }
    };
  };
  calledWithObject.rejectWith = function(value?: any) {
    calledWithObject.calledWithMap.set(calledWithArgs, Promise.reject(value));
    return {
      throwOnMismatch() {
        calledWithObject.shouldThrow = true;
      }
    };
  };
  return calledWithObject;
}
