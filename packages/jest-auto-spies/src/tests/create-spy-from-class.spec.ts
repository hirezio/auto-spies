import { createSpyFromClass } from '../create-spy-from-class';
import {
  FakeClass,
  FakeAbstractClass,
  FakeGetterSetterClass,
} from './fake-classes-to-test';
import { Spy } from '../jest-auto-spies.types';
import { errorHandler } from '@hirez_io/auto-spies-core';

let fakeClassSpy: Spy<FakeClass>;
const FAKE_VALUE = 'FAKE SYNC VALUE';
let actualResult: any;
let fakeArgs: any[];
const WRONG_VALUE = 'WRONG VALUE';
let throwArgumentsErrorSpyFunction: jest.SpyInstance;

function verifyArgumentsErrorWasThrown({
  actualArgs,
  expectedMethodName,
}: {
  actualArgs: any[];
  expectedMethodName: string;
}) {
  expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(
    actualArgs,
    expectedMethodName
  );
}

describe('createSpyFromClass', () => {
  Given(() => {
    actualResult = null;
    fakeArgs = [];

    throwArgumentsErrorSpyFunction = jest
      .spyOn(errorHandler, 'throwArgumentsError')
      .mockImplementation();
    fakeClassSpy = createSpyFromClass(FakeClass);
  });

  describe('GIVEN a synchronous method is being configured', () => {
    Given(() => {
      fakeClassSpy.getSyncValue.mockReturnValue(FAKE_VALUE);
    });

    When(() => {
      actualResult = fakeClassSpy.getSyncValue();
    });

    Then(() => {
      expect(actualResult).toBe(FAKE_VALUE);
    });
  });

  describe('GIVEN a synchronous method is being manually configured', () => {
    Given(() => {
      fakeClassSpy = createSpyFromClass(FakeClass, ['arrowMethod']);
      fakeClassSpy.arrowMethod.mockReturnValue(FAKE_VALUE);
    });

    When(() => {
      actualResult = fakeClassSpy.arrowMethod();
    });

    Then('return the correct value', () => {
      expect(actualResult).toBe(FAKE_VALUE);
    });
  });

  describe('GIVEN a synchronous method is being manually configured using the config object', () => {
    Given(() => {
      fakeClassSpy = createSpyFromClass(FakeClass, {
        methodsToSpyOn: ['arrowMethod'],
      });
      fakeClassSpy.arrowMethod.mockReturnValue(FAKE_VALUE);
    });

    When(() => {
      actualResult = fakeClassSpy.arrowMethod();
    });

    Then('return the correct value', () => {
      expect(actualResult).toBe(FAKE_VALUE);
    });
  });

  describe(`GIVEN a synchronous method is being configured with specific parameters
           and returns a non undefined value`, () => {
    Given(() => {
      fakeArgs = [1, { a: 2 }];
      fakeClassSpy.getSyncValue.calledWith(...fakeArgs).mockReturnValue(FAKE_VALUE);
    });

    describe('WHEN it is called with the expected parameters', () => {
      When(() => {
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs);
      });

      Then('return the correct value', () => {
        expect(actualResult).toBe(FAKE_VALUE);
      });
    });

    describe(`GIVEN it is configured differently for the same input arguments 
              WHEN it is called with the expected parameters`, () => {
      Given(() => {
        fakeClassSpy.getSyncValue.calledWith(...fakeArgs).mockReturnValue('FAKE VALUE 2');
      });

      When(() => {
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs);
      });

      Then('return the correct value', () => {
        expect(actualResult).toBe('FAKE VALUE 2');
      });
    });

    describe('WHEN it is called with the wrong parameters', () => {
      When(() => {
        actualResult = fakeClassSpy.getSyncValue(WRONG_VALUE);
      });

      Then('return undefined', () => {
        expect(actualResult).toBeUndefined();
      });
    });

    describe(`GIVEN another calledWith is configured
              WHEN method is called twice`, () => {
      let actualResult2: any;
      let fakeArgs2: any[];
      let fakeValue2: any;
      Given(() => {
        actualResult2 = undefined;
        fakeValue2 = 'FAKE VALUE 2';
        fakeArgs2 = [3, 4];
        fakeClassSpy.getSyncValue.calledWith(...fakeArgs2).mockReturnValue(fakeValue2);
      });

      When(() => {
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs);
        actualResult2 = fakeClassSpy.getSyncValue(...fakeArgs2);
      });

      Then('return the correct value for each call', () => {
        expect(actualResult).toBe(FAKE_VALUE);
        expect(actualResult2).toBe(fakeValue2);
      });
    });

    describe('WHEN called with the wrong parameters', () => {
      When(() => {
        actualResult = fakeClassSpy.getSyncValue(WRONG_VALUE);
      });

      Then('do NOT throw an error', () => {
        expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
      });
    });
  });

  describe(`GIVEN a synchronous method is being configured with specific parameters
            and returns a null value
            WHEN called with the matching parameters`, () => {
    Given(() => {
      fakeArgs = [1, { a: 2 }];
      fakeClassSpy.getNullableSyncValue.calledWith(...fakeArgs).mockReturnValue(null);
    });

    When(() => {
      actualResult = fakeClassSpy.getNullableSyncValue(...fakeArgs);
    });

    Then('return null', () => {
      expect(actualResult).toBeNull();
    });
  });

  describe(`GIVEN a synchronous method is configured to throw on mismatch
            WHEN called with the wrong parameters`, () => {
    let expectedMethodName: string;
    Given(() => {
      expectedMethodName = 'getSyncValue';
      fakeArgs = [1, { a: 2 }];
      fakeClassSpy.getSyncValue.mustBeCalledWith(...fakeArgs).mockReturnValue(FAKE_VALUE);
    });
    When(() => {
      actualResult = fakeClassSpy.getSyncValue(WRONG_VALUE);
    });

    Then('throw an error', () => {
      verifyArgumentsErrorWasThrown({
        expectedMethodName,
        actualArgs: [WRONG_VALUE],
      });
    });
  });

  describe(`GIVEN a synchronous method is configured with mustBeCalledWith twice with different values`, () => {
    let fakeArgs2: any[];
    Given(() => {
      fakeArgs = [1, { a: 2 }];
      fakeArgs2 = [1, { a: 3 }];
      fakeClassSpy.getSyncValue.mustBeCalledWith(...fakeArgs).mockReturnValue(FAKE_VALUE);

      fakeClassSpy.getSyncValue
        .mustBeCalledWith(...fakeArgs2)
        .mockReturnValue(FAKE_VALUE);
    });

    describe(`WHEN called twice with the right parameters`, () => {
      When(() => {
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs);
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs2);
      });

      Then('do NOT throw an error', () => {
        expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
      });
    });

    describe(`WHEN called second time with the wrong parameters`, () => {
      let expectedMethodName: string;
      Given(() => {
        expectedMethodName = 'getSyncValue';
      });

      When(() => {
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs);
        actualResult = fakeClassSpy.getSyncValue(WRONG_VALUE);
      });

      Then('throw an error with the wrong value', () => {
        verifyArgumentsErrorWasThrown({
          expectedMethodName,
          actualArgs: [WRONG_VALUE],
        });
      });
    });
  });

  describe('GIVEN an abstract class', () => {
    let abstractClassSpy: Spy<FakeAbstractClass>;

    describe('GIVEN sync method is configured', () => {
      Given(() => {
        abstractClassSpy = createSpyFromClass(FakeAbstractClass as any);
        abstractClassSpy.getSyncValue.mockReturnValue('FAKE');
      });

      When(() => {
        actualResult = abstractClassSpy.getSyncValue();
      });
      Then('return the correct value', () => {
        expect(actualResult).toBe('FAKE');
      });
    });

    describe('GIVEN abstract method is configured', () => {
      Given(() => {
        abstractClassSpy = createSpyFromClass(FakeAbstractClass as any, [
          'needToImplementThis',
        ]);
        abstractClassSpy.needToImplementThis.mockReturnValue('FAKE');
      });

      When(() => {
        actualResult = abstractClassSpy.needToImplementThis();
      });
      Then('return the correct value', () => {
        expect(actualResult).toBe('FAKE');
      });
    });
  });

  describe('getters and setters', () => {
    let fakeGetterSetterClass: Spy<FakeGetterSetterClass>;

    describe('GIVEN spying on class with a property that has both getter and setter', () => {
      Given(() => {
        fakeGetterSetterClass = createSpyFromClass(FakeGetterSetterClass, {
          gettersToSpyOn: ['myProp'],
          settersToSpyOn: ['myProp'],
        });
      });
      describe('GIVEN getter spy configured with fake return value', () => {
        Given(() => {
          fakeGetterSetterClass.accessorSpies.getters.myProp.mockReturnValue(FAKE_VALUE);
        });
        Then('return the fake value', () => {
          expect(fakeGetterSetterClass.myProp).toBe(FAKE_VALUE);
        });
      });

      describe('GIVEN setter spy configured WHEN setting the var', () => {
        When(() => {
          fakeGetterSetterClass.myProp = '2';
        });
        Then('allow spying on setter', () => {
          expect(fakeGetterSetterClass.accessorSpies.setters.myProp).toHaveBeenCalled();
        });
      });
    });

    describe(`GIVEN spying on class with a property that has only a getter
              and getter spy configured with fake return value`, () => {
      Given(() => {
        fakeGetterSetterClass = createSpyFromClass(FakeGetterSetterClass, {
          gettersToSpyOn: ['anotherGetter'],
        });

        fakeGetterSetterClass.accessorSpies.getters.anotherGetter.mockReturnValue(222);
      });

      Then('return the fake value', () => {
        expect(fakeGetterSetterClass.anotherGetter).toBe(222);
      });
    });

    describe(`GIVEN spying on class with a property that has only a setter
              WHEN variable is set`, () => {
      Given(() => {
        fakeGetterSetterClass = createSpyFromClass(FakeGetterSetterClass, {
          settersToSpyOn: ['mySetter'],
        });
      });
      When(() => {
        fakeGetterSetterClass.mySetter = 2222;
      });
      Then('allow spying on setter', () => {
        expect(fakeGetterSetterClass.accessorSpies.setters.mySetter).toHaveBeenCalledWith(
          2222
        );
      });
    });
  });
});
