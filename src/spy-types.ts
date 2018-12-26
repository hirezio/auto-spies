/// <reference types="jasmine" />
import { Observable } from 'rxjs';

export type Spy<T> = { [k in keyof T]: AddSpyTypes<T[k]> };

export type AddSpyTypes<T> = T extends (...args: any[]) => any
  ? AddSpyByReturnTypes<T>
  : T;

// this will add spy types on every proeprty of the given type.
// not only functions by return value.
// export type AddSpyTypes<T> = T extends (...args: any[]) => any
//   ? AddSpyOnReturnTypes<T>
//   : T extends Promise<any>
//     ? AddSpyOnPromise<T>
//     : T extends Observable<any> ? AddSpyOnObservable<T> : T;

export interface PromiseSpyMethod<T> {
  resolveWith(value: T): void;
  rejectWith(value: any): void;
}

export interface ObservableSpyMethod<T> {
  nextWith(value: T): void;
  nextOneTimeWith(value: T): void; // emit one value and completes
  throwWith(value: any): void;
  complete(): void;
}

export interface SpyMethod {
  calledWith(
    ...args: any[]
  ): {
    returnValue: (value: any) => void;
  };
}

export type AddSpyOnFunction<T extends (...args: any[]) => any> = T &
  SpyMethod &
  jasmine.Spy;

export type AddSpyOnPromise<T extends Promise<any>> = {
  and: PromiseSpyMethod<Unpacked<T>>;
  calledWith(...args: any[]): PromiseSpyMethod<T>;
} & jasmine.Spy;

export type AddSpyOnObservable<T extends Observable<any>> = {
  and: ObservableSpyMethod<Unpacked<T>>;
  calledWith(...args: any[]): ObservableSpyMethod<T>;
} & jasmine.Spy;

// Wrap the return type of the given function type with the appropriate spy methods
export type AddSpyByReturnTypes<TF extends (...args: any[]) => any> = TF &
  (TF extends (...args: any[]) => infer TR // returns a function
    ? TR extends (...args: any[]) => infer R2
      ? AddSpyOnFunction<TR> // returns a Promise
      : TR extends Promise<any>
        ? AddSpyOnPromise<TR> // returns an Observable
        : TR extends Observable<any>
          ? AddSpyOnObservable<TR>
          : AddSpyOnFunction<TF>
    : never);

// export type AddSpyOnFunctionReturnType<
//   TF extends (...args: any[]) => any
// > = TF extends (...args: any[]) => any
//   ? TF & { and: AddSpyOnReturnTypes<TF> }
//   : never;

// https://github.com/Microsoft/TypeScript/issues/21705#issue-294964744
export type Unpacked<T> = T extends Array<infer U1>
  ? U1
  : T extends (...args: any[]) => infer U2
    ? U2
    : T extends Promise<infer U3>
      ? U3
      : T extends Observable<infer U4> ? U4 : T;
