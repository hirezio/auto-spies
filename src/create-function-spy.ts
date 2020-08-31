import { AddSpyTypes } from '.';
import {
  CalledWithObject,
  FunctionSpyReturnValueContainer,
} from './create-spy-from-class.types';
import {
  addPromiseHelpersToFunctionSpy,
  addPromiseHelpersToCalledWithObject,
} from './promises/promises-spy-utils';
import {
  addObservableHelpersToFunctionSpy,
  addObservableHelpersToCalledWithObject,
} from './observables/observable-spy-utils';
import deepEqual from 'deep-equal';
import { throwArgumentsError } from './errors/error-handling';

export function createFunctionSpy<MT>(name: string): AddSpyTypes<MT> {
  const functionSpy: any = jasmine.createSpy(name);

  let calledWithObject: CalledWithObject = {
    wasConfigured: false,
    argsToValuesMap: new Map(),
  };

  let mustBeCalledWithObject: CalledWithObject = {
    wasConfigured: false,
    argsToValuesMap: new Map(),
  };

  const valueContainer: FunctionSpyReturnValueContainer = {
    value: undefined,
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
    calledWithObject.wasConfigured = true;
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
    mustBeCalledWithObject.wasConfigured = true;
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
  valueContainer: FunctionSpyReturnValueContainer,
  actualArgs: any[]
) {
  if (calledWithObject.wasConfigured) {
    for (const storedCalledWithArgs of calledWithObject.argsToValuesMap.keys()) {
      if (deepEqual(storedCalledWithArgs, actualArgs)) {
        return calledWithObject.argsToValuesMap.get(storedCalledWithArgs);
      }
    }
  }
  if (mustBeCalledWithObject.wasConfigured) {
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
