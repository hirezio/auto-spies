/// <reference types="jasmine" />
import { Observable, Subject } from 'rxjs';

export type Spy<T> = {
  [k in keyof T]: T[k] extends (...args: any[]) => any
    ? AddSpyTypesToMethods<T[k]>
    : T[k] extends Observable<infer OR>
    ? T[k] & AddObservableSpyMethods<OR>
    : T[k];
};

export type AddSpyTypesToMethods<T> = T extends (...args: any[]) => any
  ? AddSpyByReturnTypes<T>
  : T;

// Wrap the return type of the given function type with the appropriate spy methods
export type AddSpyByReturnTypes<TF extends (...args: any[]) => any> = TF &
  (TF extends (...args: any[]) => infer TR
    ? // returns a Promise
      TR extends Promise<infer PR>
      ? AddSpyToPromiseMethod<PR>
      : // returns an Observable
      TR extends Observable<infer OR>
      ? AddSpyToObservableMethod<OR>
      : // for any other type
        AddSpyToMethod<TF>
    : never);

export type AddSpyToObservableProps<OP extends Observable<any>> = OP extends Observable<
  infer OR
>
  ? OP & AddObservableSpyMethods<OR>
  : OP;

export type AddSpyToPromiseMethod<PromiseReturnType> = {
  and: PromiseMethodSpy<PromiseReturnType>;
  calledWith(...args: any[]): PromiseMethodSpy<PromiseReturnType>;
  mustBeCalledWith(...args: any[]): PromiseMethodSpy<PromiseReturnType>;
} & jasmine.Spy;

export interface PromiseMethodSpy<T> {
  resolveWith(value?: T): void;
  rejectWith(value?: any): void;
}

export type AddSpyToObservableMethod<ObservableReturnType> = {
  and: AddObservableSpyMethods<ObservableReturnType>;
  calledWith(...args: any[]): AddObservableSpyMethods<ObservableReturnType>;
  mustBeCalledWith(...args: any[]): AddObservableSpyMethods<ObservableReturnType>;
} & jasmine.Spy;

export interface AddObservableSpyMethods<T> {
  nextWith(value?: T): void;
  nextOneTimeWith(value?: T): void; // emit one value and completes
  throwWith(value: any): void;
  complete(): void;
  returnSubject(): Subject<T>;
}

export interface MethodSpy {
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

export type AddSpyToMethod<T extends (...args: any[]) => any> = T &
  MethodSpy &
  jasmine.Spy;

type KeysForPropertyType<ObjectType, PropType> = Extract<
  {
    [Key in keyof ObjectType]: ObjectType[Key] extends PropType ? Key : never;
  }[keyof ObjectType],
  string
>;

export type OnlyMethodKeysOf<T> = KeysForPropertyType<T, { (...args: any[]): any }>;

export type OnlyObservablePropsOf<T> = KeysForPropertyType<T, Observable<any>>;

export type GetObservableReturnType<OT> = OT extends Observable<infer OR> ? OR : never;
