import { Observable, Subject } from 'rxjs';
import { Func, ValueConfigPerCall } from '../auto-spies-core.types';

export type CreateObservableAutoSpy<
  LibSpecificFunctionSpy,
  LibSpecificFunctionSpyWithObservableMethods,
  Method extends Func
> = LibSpecificFunctionSpy &
  LibSpecificFunctionSpyWithObservableMethods &
  AddCalledWithToObservableFunctionSpy<Method>;

export type AddCalledWithToObservableFunctionSpy<Method extends Func> = Method &
  (Method extends (...args: any[]) => infer ReturnType
    ? ReturnType extends Observable<infer ObservableReturnType>
      ? {
          calledWith(
            ...args: Parameters<Method>
          ): AddObservableSpyMethods<ObservableReturnType>;
          mustBeCalledWith(
            ...args: Parameters<Method>
          ): AddObservableSpyMethods<ObservableReturnType>;
        }
      : never
    : never);

export interface AddObservableSpyMethods<T> {
  nextWith(value?: T): void;
  nextOneTimeWith(value?: T): void; // emit one value and completes
  nextWithValues(valuesConfigs: ValueConfig<T>[]): void;
  nextWithPerCall(valuesPerCall?: ValueConfigPerCall<T>[]): Subject<T>[];
  throwWith(value: any): void;
  complete(): void;
  returnSubject(): Subject<T>;
}

export type ValueConfig<T> = NextValueConfig<T> | ErrorValueConfig | CompleteValueConfig;

export type NextValueConfig<T> = {
  value: T;
  delay?: number;
};

export type ErrorValueConfig = {
  errorValue: any;
  delay?: number;
};

export type CompleteValueConfig = {
  complete?: boolean;
  delay?: number;
};
