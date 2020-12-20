import { Subject } from 'rxjs';
import { ValueConfigPerCall } from '../auto-spies-core.types';

export type CreateObservableAutoSpy<
  LibSpecificFunctionSpy,
  LibSpecificFunctionSpyWithObservableMethods,
  ObservableReturnType
> = LibSpecificFunctionSpy &
  LibSpecificFunctionSpyWithObservableMethods &
  AddCalledWithToObservableFunctionSpy<ObservableReturnType>;

export type AddCalledWithToObservableFunctionSpy<ObservableReturnType> = {
  calledWith(...args: any[]): AddObservableSpyMethods<ObservableReturnType>;
  mustBeCalledWith(...args: any[]): AddObservableSpyMethods<ObservableReturnType>;
};

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
