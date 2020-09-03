import { Spy, OnlyMethodKeysOf, OnlyObservablePropsOf } from './auto-spies.types';
import { createFunctionSpy } from './create-function-spy';
import { createObservablePropSpy } from './observables/observable-spy-utils';

export interface ClassSpyConfiguration<T> {
  providedMethodNames?: OnlyMethodKeysOf<T>[];
  observablePropsToSpyOn?: OnlyObservablePropsOf<T>[];
}

export function createSpyFromClass<T>(
  ObjectClass: { new (...args: any[]): T; [key: string]: any },
  providedMethodNamesOrConfig?: OnlyMethodKeysOf<T>[] | ClassSpyConfiguration<T>
): Spy<T> {
  const proto = ObjectClass.prototype;
  const methodNames = getAllMethodNames(proto);

  let providedMethodNames: OnlyMethodKeysOf<T>[] = [];
  let observablePropsToSpyOn: OnlyObservablePropsOf<T>[] = [];

  if (providedMethodNamesOrConfig) {
    if (Array.isArray(providedMethodNamesOrConfig)) {
      providedMethodNames = providedMethodNamesOrConfig;
    } else {
      observablePropsToSpyOn = providedMethodNamesOrConfig.observablePropsToSpyOn || [];
      providedMethodNames = providedMethodNamesOrConfig.providedMethodNames || [];
    }
  }
  if (providedMethodNames.length > 0) {
    methodNames.push(...providedMethodNames);
  }

  const autoSpy: any = {};

  if (observablePropsToSpyOn.length > 0) {
    observablePropsToSpyOn.forEach((observablePropName) => {
      autoSpy[observablePropName] = createObservablePropSpy();
    });
  }

  methodNames.forEach((methodName) => {
    autoSpy[methodName] = createFunctionSpy(methodName);
  });
  return autoSpy as Spy<T>;
}

function getAllMethodNames(obj: any): string[] {
  let methods: string[] = [];

  while (obj) {
    const parentObj = Object.getPrototypeOf(obj);
    // we don't want to spy on Function.prototype methods
    if (parentObj) {
      methods = methods.concat(Object.getOwnPropertyNames(obj));
    }
    obj = parentObj;
  }

  const constructorIndex = methods.indexOf('constructor');
  if (constructorIndex >= 0) {
    methods.splice(constructorIndex, 1);
  }
  return methods;
}
