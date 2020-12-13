/// <reference types="jasmine" />
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

export type Spy<ClassToSpyOn> = AddAutoSpies<ClassToSpyOn, jasmine.Spy> &
  AddAccessorsSpies<ClassToSpyOn, jasmine.Spy>;

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
          AddPromisesToJasmineFunctionSpy<PromiseReturnType>,
          PromiseReturnType
        >
      : // returns an Observable
      ReturnType extends Observable<infer ObservableReturnType>
      ? CreateObservableAutoSpy<
          LibSpecificFunctionSpy,
          AddObservablesToJasmineFunctionSpy<ObservableReturnType>,
          ObservableReturnType
        >
      : // for any other type
        CreateSyncAutoSpy<
          Method,
          LibSpecificFunctionSpy,
          AddCalledWithToJasmineFunctionSpy
        >
    : never);

type AddPromisesToJasmineFunctionSpy<PromiseReturnType> = {
  and: AddPromiseSpyMethods<PromiseReturnType>;
};

type AddObservablesToJasmineFunctionSpy<ObservableReturnType> = {
  and: AddObservableSpyMethods<ObservableReturnType>;
};

export interface AddCalledWithToJasmineFunctionSpy {
  calledWith(
    ...args: any[]
  ): {
    returnValue: (value: any) => void;
  };
  mustBeCalledWith(
    ...args: any[]
  ): {
    returnValue: (value: any) => void;
  };
}
