import { Spy } from './jest-auto-spies.types';
import { createFunctionSpy } from './create-function-spy';
import {
  OnlyMethodKeysOf,
  ClassSpyConfiguration,
  createAutoSpyFromClass,
  ClassType,
} from '@hirez_io/auto-spies-core';

export { ClassSpyConfiguration } from '@hirez_io/auto-spies-core';

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
): jest.SpyInstance {
  if (accessorType === 'setter') {
    return jest.spyOn(autoSpy, accessorName, 'set');
  }
  return jest.spyOn(autoSpy, accessorName, 'get');
}
