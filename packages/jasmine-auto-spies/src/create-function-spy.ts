import { AddSpyMethodsByReturnTypes } from '.';
import { CalledWithObject, createFunctionAutoSpy, Func } from '@hirez_io/auto-spies-core';

type JasmineCalledWithObject = { returnValue: (...args: any[]) => void };

export function createFunctionSpy<FunctionType extends Func>(
  name: string
): AddSpyMethodsByReturnTypes<FunctionType, jasmine.Spy> {
  return createFunctionAutoSpy(
    name,
    addJasmineSyncMethodsToCalledWithObject,
    jasmineFunctionSpyFactory
  );
}

function jasmineFunctionSpyFactory(name: string, spyFunctionImpl: Func) {
  const functionSpy = jasmine.createSpy(name);
  functionSpy.and.callFake(spyFunctionImpl);
  return {
    functionSpy,
    objectToAddSpyMethodsTo: functionSpy.and,
  };
}

function addJasmineSyncMethodsToCalledWithObject(
  calledWithObject: any,
  calledWithArgs: any[]
): CalledWithObject & JasmineCalledWithObject {
  calledWithObject.returnValue = (value: any) => {
    calledWithObject.argsToValuesMap.set(calledWithArgs, value);
  };
  return calledWithObject;
}
