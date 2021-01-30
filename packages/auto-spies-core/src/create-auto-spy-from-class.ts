import {
  AccessorSpyFactory,
  OnlyMethodKeysOf,
  OnlyObservablePropsOf,
  OnlyPropsOf,
  createObservablePropSpy,
  createAccessorsSpies,
} from '.';

export interface ClassSpyConfiguration<T> {
  methodsToSpyOn?: OnlyMethodKeysOf<T>[];
  observablePropsToSpyOn?: OnlyObservablePropsOf<T>[];
  settersToSpyOn?: OnlyPropsOf<T>[];
  gettersToSpyOn?: OnlyPropsOf<T>[];

  providedMethodNames?: OnlyMethodKeysOf<T>[]; // deprecated
}

export function createAutoSpyFromClass<
  T,
  AutoSpyType,
  FrameworkSpecificFunctionSpy,
  FunctionAutoSpyType
>(
  ObjectClass: { new (...args: any[]): T; [key: string]: any },
  createFunctionSpy: (name: string) => FunctionAutoSpyType,
  accessorSpyFactory: AccessorSpyFactory<FrameworkSpecificFunctionSpy>,
  methodsToSpyOnOrConfig?: OnlyMethodKeysOf<T>[] | ClassSpyConfiguration<T>
): AutoSpyType {
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

  createAccessorsSpies(autoSpy, gettersToSpyOn, settersToSpyOn, accessorSpyFactory);

  methodNames.forEach((methodName) => {
    autoSpy[methodName] = createFunctionSpy(methodName);
  });

  return autoSpy as AutoSpyType;
}

function getAllMethodNames(obj: any): string[] {
  let methods: string[] = [];

  while (obj) {
    const parentObj = Object.getPrototypeOf(obj);
    // we don't want to spy on Function.prototype methods
    if (parentObj) {
      methods = methods.concat(extractMethodsFromObject(obj));
    }
    obj = parentObj;
  }
  return methods;
}

function extractMethodsFromObject(obj: any) {
  const propertyDescriptors = Object.getOwnPropertyDescriptors(obj);
  return Object.keys(propertyDescriptors).reduce((names, name) => {
    const descriptor = propertyDescriptors[name];
    if (name !== 'constructor' && !descriptor.get) {
      names.push(name);
    }
    return names;
  }, [] as string[]);
}
