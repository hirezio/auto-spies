import { Spy } from './jasmine-auto-spies.types';
import { createFunctionSpy } from './create-function-spy';
import {
  OnlyMethodKeysOf,
  ClassSpyConfiguration,
  createAutoSpyFromClass,
  ClassType,
} from '@hirez_io/auto-spies-core';

export function createSpyFromClass<T>(
  ObjectClass: ClassType<T>,
  methodsToSpyOnOrConfig?: OnlyMethodKeysOf<T>[] | ClassSpyConfiguration<T>
): Spy<T> {
  const autoSpy = createAutoSpyFromClass(
    ObjectClass,
    createFunctionSpy,
    accessorSpyFactory,
    methodsToSpyOnOrConfig
  );
  return autoSpy as Spy<T>;
}

function accessorSpyFactory(
  autoSpy: any,
  accessorName: string,
  accessorType: 'getter' | 'setter'
): jasmine.Spy {
  if (accessorType === 'setter') {
    return spyOnProperty(autoSpy, accessorName, 'set');
  }
  return spyOnProperty(autoSpy, accessorName);
}
