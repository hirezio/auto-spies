import { ValueConfigPerCall } from '../auto-spies-core.types';

export type CreatePromiseAutoSpy<
  LibSpecificFunctionSpy,
  LibSpecificFunctionSpyWithPromisesMethods,
  PromiseReturnType
> = LibSpecificFunctionSpy &
  LibSpecificFunctionSpyWithPromisesMethods &
  AddCalledWithToPromiseFunctionSpy<PromiseReturnType>;

export type AddCalledWithToPromiseFunctionSpy<PromiseReturnType> = {
  calledWith(...args: any[]): AddPromiseSpyMethods<PromiseReturnType>;
  mustBeCalledWith(...args: any[]): AddPromiseSpyMethods<PromiseReturnType>;
};

export interface AddPromiseSpyMethods<T> {
  resolveWith(value?: T): void;
  rejectWith(value?: any): void;
  resolveWithPerCall(valuesPerCall: ValueConfigPerCall<T>[]): void;
}
