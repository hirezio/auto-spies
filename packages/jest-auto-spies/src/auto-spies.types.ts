import { Observable } from 'rxjs';
import {
  AddObservableSpyMethods,
  AddPromiseSpyMethods,
  Func,
  AddAccessorsSpies,
  CreateSyncAutoSpy,
  CreateObservableAutoSpy,
  CreatePromiseAutoSpy,
} from '@hirez_io/auto-spies-core';

export type Spy<ClassToSpyOn> = AddAutoSpies<ClassToSpyOn, jest.Mock> &
  AddAccessorsSpies<ClassToSpyOn, jest.Mock>;

type AddAutoSpies<ClassToSpyOn, LibSpecificFunctionSpy> = {
  [Key in keyof ClassToSpyOn /* 
  if it's a method */]: ClassToSpyOn[Key] extends Func
    ? AddSpyMethodsByReturnTypes<ClassToSpyOn[Key], LibSpecificFunctionSpy>
    : // if it's a property of type Observable
    ClassToSpyOn[Key] extends Observable<infer ObservableReturnType>
    ? ClassToSpyOn[Key] & AddObservableSpyMethods<ObservableReturnType>
    : // If not a method or an observable, leave as is
      ClassToSpyOn[Key];
};

// Wrap the return type of the given function type with the appropriate spy methods
export type AddSpyMethodsByReturnTypes<
  Method extends Func,
  LibSpecificFunctionSpy
> = Method &
  (Method extends (...args: any[]) => infer ReturnType
    ? // returns a Promise
      ReturnType extends Promise<infer PromiseReturnType>
      ? CreatePromiseAutoSpy<
          LibSpecificFunctionSpy,
          AddPromiseSpyMethods<PromiseReturnType>,
          PromiseReturnType
        >
      : // returns an Observable
      ReturnType extends Observable<infer ObservableReturnType>
      ? CreateObservableAutoSpy<
          LibSpecificFunctionSpy,
          AddObservableSpyMethods<ObservableReturnType>,
          ObservableReturnType
        >
      : // for any other type
        CreateSyncAutoSpy<Method, LibSpecificFunctionSpy, AddCalledWithToJestFunctionSpy>
    : never);

export interface AddCalledWithToJestFunctionSpy {
  calledWith(
    ...args: any[]
  ): {
    mockReturnValue: (value: any) => void;
  };
  mustBeCalledWith(
    ...args: any[]
  ): {
    mockReturnValue: (value: any) => void;
  };
}
