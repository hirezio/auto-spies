import { Subject } from 'rxjs';

export interface FunctionSpyReturnValueContainer {
  value: any;
}

export interface CalledWithObject {
  wasConfigured: boolean;
  argsToValuesMap: Map<any, any>;
  returnValue?: (value: any) => void;
  resolveWith?: (value?: any) => void;
  rejectWith?: (value?: any) => void;
  nextWith?(value?: any): void;
  nextOneTimeWith?(value?: any): void;
  throwWith?(value: any): void;
  complete?(): void;
  returnSubject?<R = any>(): Subject<R>;
}
