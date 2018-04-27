/// <reference types="jasmine" />
import { Observable } from "rxjs";

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

export interface PromiseSpy<T> {
  resolveWith(value: T): void;
  rejectWith(value: any): void;
}

export interface ObservableSpy<T> {
  nextWith(value: T): void;
  nextWithError(value: any): void;
}

export type AddSpyOnFunction<T extends (...args: any[]) => R, R> = T & {
  and: jasmine.Spy;
};

export type AddSpyOnPromise<T extends Promise<any>> = T & {
  and: PromiseSpy<Unpacked<T>>;
};
export type AddSpyOnObservable<T extends Observable<any>> = T & {
  and: ObservableSpy<Unpacked<T>>;
};

// Wrap the return type of the given function type with the appropriate spy methods
export type AddSpyByReturnTypes<
  TF extends (...args: any[]) => any
> = TF extends (...args: any[]) => infer TR // returnes a function
  ? TR extends (...args: any[]) => infer R2
    ? AddSpyOnFunction<TR, R2> // returnes a Promise
    : TR extends Promise<any>
      ? AddSpyOnPromise<TR> // returnes an Observable
      : TR extends Observable<any> ? AddSpyOnObservable<TR> : TF
  : never;

// export type AddSpyOnFunctionReturnType<
//   TF extends (...args: any[]) => any
// > = TF extends (...args: any[]) => any
//   ? TF & { and: AddSpyOnReturnTypes<TF> }
//   : never;

//github.com/Microsoft/TypeScript/issues/21705#issue-294964744
export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
    ? U
    : T extends Promise<infer U> ? U : T extends Observable<infer U> ? U : T;
