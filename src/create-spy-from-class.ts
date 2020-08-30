import { Spy } from './auto-spies.types';
import { createFunctionSpy } from './create-function-spy';

export function createSpyFromClass<T>(
  ObjectClass: { new (...args: any[]): T; [key: string]: any },
  providedMethodNames?: string[]
): Spy<T> {
  const proto = ObjectClass.prototype;
  const methodNames = getAllMethodNames(proto);
  if (providedMethodNames && providedMethodNames.length > 0) {
    methodNames.push(...providedMethodNames);
  }

  const autoSpy: any = {};

  methodNames.forEach((methodName) => {
    autoSpy[methodName] = createFunctionSpy(methodName);
  });
  return autoSpy as Spy<T>;
}

function getAllMethodNames(obj: any): string[] {
  let methods: string[] = [];

  do {
    methods = methods.concat(Object.getOwnPropertyNames(obj));
    obj = Object.getPrototypeOf(obj);
  } while (obj);

  const constructorIndex = methods.indexOf('constructor');
  if (constructorIndex >= 0) {
    methods.splice(constructorIndex, 1);
  }
  return methods;
}
