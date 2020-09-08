import { Subject } from 'rxjs';

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
  throwWith(value: any): void;
  complete(): void;
  returnSubject(): Subject<T>;
}
