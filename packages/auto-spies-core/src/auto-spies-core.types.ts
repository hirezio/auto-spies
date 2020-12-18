import { Observable } from 'rxjs';

export type Func = (...args: any[]) => any;

export type ClassType<T> = { new (...args: any[]): T; [key: string]: any };

export type CreateSyncAutoSpy<
  Method extends Func,
  LibSpecificFunctionSpy,
  LibSpecificFunctionSpyPlusCalledWith
> = Method & LibSpecificFunctionSpy & LibSpecificFunctionSpyPlusCalledWith;

type StringKeysForPropertyType<ObjectType, PropType> = Extract<
  {
    [Key in keyof ObjectType]: ObjectType[Key] extends PropType ? Key : never;
  }[keyof ObjectType],
  string
>;

export type OnlyMethodKeysOf<T> = StringKeysForPropertyType<T, { (...args: any[]): any }>;

export type OnlyObservablePropsOf<T> = StringKeysForPropertyType<T, Observable<any>>;

export type GetObservableReturnType<OT> = OT extends Observable<infer OR> ? OR : never;

export type OnlyPropsOf<ObjectType> = Extract<
  {
    [Key in keyof ObjectType]: ObjectType[Key] extends Func ? never : Key;
  }[keyof ObjectType],
  string
>;

export type ValueConfigPerCall<T> = {
  value: T;
  delay?: number;
  doNotComplete?: boolean;
};

export type WrappedValueConfigPerCall<T = any> = {
  wrappedValue: Promise<T> | Observable<T>;
  delay?: number;
};
