// This saves time by shortening the repetitive syntax of providing
// an auto spy in Angular tests.

import {
  ClassSpyConfiguration,
  ClassType,
  OnlyMethodKeysOf,
} from '@hirez_io/auto-spies-core';
import { createSpyFromClass } from './create-spy-from-class';
import { Spy } from './jasmine-auto-spies.types';

export type AngularValueProvider<T> = {
  provide: ClassType<T>;
  useValue: Spy<T>;
};

export function provideAutoSpy<T>(
  ObjectClass: ClassType<T>,
  methodsToSpyOnOrConfig?: OnlyMethodKeysOf<T>[] | ClassSpyConfiguration<T>
): AngularValueProvider<T> {
  return {
    provide: ObjectClass,
    useValue: createSpyFromClass(ObjectClass, methodsToSpyOnOrConfig),
  };
}
