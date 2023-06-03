import { AddSpyMethodsByReturnTypes } from '.';
import { CalledWithObject, createFunctionAutoSpy, Func } from '@hirez_io/auto-spies-core';

type JestCalledWithObject = { mockReturnValue: (...args: any[]) => void };

export function createFunctionSpy<FunctionType extends Func>(
  name: string
): AddSpyMethodsByReturnTypes<FunctionType> {
  return createFunctionAutoSpy(
    name,
    addJestSyncMethodsToCalledWithObject,
    jestFunctionSpyFactory
  );
}

function jestFunctionSpyFactory(name: string, spyFunctionImpl: Func) {
  const functionSpy = jest.fn().mockName(name);
  functionSpy.mockImplementation(spyFunctionImpl);
  return {
    functionSpy,
    objectToAddSpyMethodsTo: functionSpy,
  };
}

function addJestSyncMethodsToCalledWithObject(
  calledWithObject: any,
  calledWithArgs: any[]
): CalledWithObject & JestCalledWithObject {
  calledWithObject.mockReturnValue = (value: any) => {
    calledWithObject.argsToValuesMap.set(calledWithArgs, { value });
  };
  return calledWithObject;
}
