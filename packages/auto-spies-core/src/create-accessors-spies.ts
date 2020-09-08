/* eslint-disable @typescript-eslint/no-empty-function */
export type AddAccessorsSpies<T, LibSpecificFunctionSpy> = T & {
  accessorSpies: {
    setters: {
      [k in keyof T]: LibSpecificFunctionSpy;
    };
    getters: {
      [k in keyof T]: LibSpecificFunctionSpy;
    };
  };
};

export type AccessorSpyFactory<PropertySpy> = (
  autoSpy: any,
  accessorName: string,
  accessorType: 'getter' | 'setter'
) => PropertySpy;

export function createAccessorsSpies<PropertySpy>(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  autoSpy: any,
  gettersToSpyOn: string[],
  settersToSpyOn: string[],
  accessorSpyFactory: AccessorSpyFactory<PropertySpy>
): void {
  autoSpy.accessorSpies = {
    setters: {},
    getters: {},
  };

  /* istanbul ignore else */
  if (gettersToSpyOn) {
    gettersToSpyOn.forEach((getterName) => {
      defineWithEmptyAccessors(autoSpy, getterName);
      autoSpy.accessorSpies.getters[getterName] = accessorSpyFactory(
        autoSpy,
        getterName,
        'getter'
      );
    });
  }

  /* istanbul ignore else */
  if (settersToSpyOn) {
    settersToSpyOn.forEach((setterName) => {
      if (!Object.prototype.hasOwnProperty.call(autoSpy, setterName)) {
        defineWithEmptyAccessors(autoSpy, setterName);
      }

      autoSpy.accessorSpies.setters[setterName] = accessorSpyFactory(
        autoSpy,
        setterName,
        'setter'
      );
    });
  }
}

function defineWithEmptyAccessors<T>(obj: T, prop: keyof T): void {
  /* istanbul ignore next */
  Object.defineProperty(obj, prop, {
    get() {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    set(_) {},
    configurable: true,
  });
}
