export interface SpyFunctionReturnValueContainer {
  value: any;
}

export interface MockTransformer {
  throwOnMismatch: () => void;
}

export interface CalledWithObject {
  calledWithMethodWasCalled: boolean;
  shouldThrow: boolean;
  calledWithMap: Map<any, any>;
  returnValue?: (value: any) => MockTransformer;
  resolveWith?: (value: any) => MockTransformer;
  rejectWith?: (value: any) => MockTransformer;
  nextWith?(value: any): MockTransformer;
  nextOneTimeWith?(value: any): MockTransformer;
  throwWith?(value: any): MockTransformer;
  complete?(): MockTransformer;
}
