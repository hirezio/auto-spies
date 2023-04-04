import { Func, ValueConfigPerCall } from '../auto-spies-core.types';

export type CreatePromiseAutoSpy<
  LibSpecificFunctionSpy,
  LibSpecificFunctionSpyWithPromisesMethods,
  Method extends Func
> = LibSpecificFunctionSpy &
  LibSpecificFunctionSpyWithPromisesMethods &
  AddCalledWithToPromiseFunctionSpy<Method>;

export type AddCalledWithToPromiseFunctionSpy<Method extends Func> = Method &
  (Method extends (...args: any[]) => infer ReturnType
    ? ReturnType extends Promise<infer PromiseReturnType>
      ? {
          calledWith(
            ...args: Parameters<Method>
          ): AddPromiseSpyMethods<PromiseReturnType>;
          mustBeCalledWith(
            ...args: Parameters<Method>
          ): AddPromiseSpyMethods<PromiseReturnType>;
        }
      : never
    : never);

export interface AddPromiseSpyMethods<T> {
  resolveWith(value?: T): void;
  rejectWith(value?: any): void;
  resolveWithPerCall(valuesPerCall: ValueConfigPerCall<T>[]): void;
}
