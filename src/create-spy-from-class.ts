/* eslint-disable @typescript-eslint/no-empty-function */
import {
  Spy,
  OnlyMethodKeysOf,
  OnlyObservablePropsOf,
  OnlyPropsOf,
} from './auto-spies.types';
import { createFunctionSpy } from './create-function-spy';
import { createObservablePropSpy } from './observables/observable-spy-utils';

export interface ClassSpyConfiguration<T> {
  methodsToSpyOn?: OnlyMethodKeysOf<T>[];
  observablePropsToSpyOn?: OnlyObservablePropsOf<T>[];
  settersToSpyOn?: OnlyPropsOf<T>[];
  gettersToSpyOn?: OnlyPropsOf<T>[];

  providedMethodNames?: OnlyMethodKeysOf<T>[]; // deprecated
}

export function createSpyFromClass<T>(
  ObjectClass: { new (...args: any[]): T; [key: string]: any },
  methodsToSpyOnOrConfig?: OnlyMethodKeysOf<T>[] | ClassSpyConfiguration<T>
): Spy<T> {
  const proto = ObjectClass.prototype;

  const methodNames = getAllMethodNames(proto);

  let methodsToSpyOn: OnlyMethodKeysOf<T>[] = [];
  let observablePropsToSpyOn: OnlyObservablePropsOf<T>[] = [];
  let settersToSpyOn: OnlyPropsOf<T>[] = [];
  let gettersToSpyOn: OnlyPropsOf<T>[] = [];

  if (methodsToSpyOnOrConfig) {
    if (Array.isArray(methodsToSpyOnOrConfig)) {
      methodsToSpyOn = methodsToSpyOnOrConfig;
    } else {
      methodsToSpyOn = methodsToSpyOnOrConfig.methodsToSpyOn || [];
      observablePropsToSpyOn = methodsToSpyOnOrConfig.observablePropsToSpyOn || [];
      settersToSpyOn = methodsToSpyOnOrConfig.settersToSpyOn || [];
      gettersToSpyOn = methodsToSpyOnOrConfig.gettersToSpyOn || [];

      /* istanbul ignore if */
      if (methodsToSpyOnOrConfig.providedMethodNames) {
        console.warn(
          '"providedMethodNames" is deprecated, please use "methodsToSpyOn" instead'
        );
        methodsToSpyOn = [
          ...methodsToSpyOn,
          ...methodsToSpyOnOrConfig.providedMethodNames,
        ];
      }
    }
  }
  if (methodsToSpyOn.length > 0) {
    methodNames.push(...methodsToSpyOn);
  }

  const autoSpy: any = {};

  if (observablePropsToSpyOn.length > 0) {
    observablePropsToSpyOn.forEach((observablePropName) => {
      autoSpy[observablePropName] = createObservablePropSpy();
    });
  }

  createAccessorsSpies(autoSpy, gettersToSpyOn, settersToSpyOn);

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

  /* istanbul ignore else */
  if (constructorIndex >= 0) {
    methods.splice(constructorIndex, 1);
  }
  return methods;
}

function createAccessorsSpies(
  autoSpy: any,
  gettersToSpyOn: string[],
  settersToSpyOn: string[]
): void {
  autoSpy.accessorSpies = {
    setters: {},
    getters: {},
  };

  /* istanbul ignore else */
  if (gettersToSpyOn) {
    gettersToSpyOn.forEach((getterName) => {
      defineWithEmptyAccessors(autoSpy, getterName);
      autoSpy.accessorSpies.getters[getterName] = spyOnProperty(autoSpy, getterName);
    });
  }

  /* istanbul ignore else */
  if (settersToSpyOn) {
    settersToSpyOn.forEach((setterName) => {
      if (!Object.prototype.hasOwnProperty.call(autoSpy, setterName)) {
        defineWithEmptyAccessors(autoSpy, setterName);
      }

      autoSpy.accessorSpies.setters[setterName] = spyOnProperty(
        autoSpy,
        setterName,
        'set'
      );
    });
  }
}

function defineWithEmptyAccessors<T>(obj: T, prop: keyof T): void {
  Object.defineProperty(obj, prop, {
    get() {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(_) {},
    configurable: true,
  });
}
