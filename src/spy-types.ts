import 'jasmine';

/**
 * The Auto Spy Object type
 */

export type Spy<T> = T & {
  [k in keyof T]: AsyncSpyFunction;
}

/**
 * Originally in Jasmine, Spy is a function and SpyObj is an Object
 * But we decided to use "Spy" for objects, and "SpyFunction" to functions.
 */
export interface AsyncSpyFunction extends jasmine.Spy {
  (...params: any[]): any;
  and: AsyncSpyFunctionAnd
}

export interface AsyncSpyFunctionAnd extends jasmine.SpyAnd {
  nextWith(value: any): void;
  resolveWith(value: any): void;
  rejectWith(value: any): void;
}