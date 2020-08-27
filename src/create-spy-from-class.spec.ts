import { createSpyFromClass } from './create-spy-from-class';
import { FakeClass, FakeAbstractClass } from './test-utils/fake-classes-to-test';
import { Spy } from './spy.types';
import * as errorHandling from './errors/error-handling';

let fakeClassSpy: Spy<FakeClass>;
let fakeValue: any;
let actualResult: any;
let fakeArgs: any[];
const WRONG_VALUE = 'WRONG VALUE';
let throwArgumentsErrorSpyFunction: jasmine.Spy;

function verifyArgumentsErrorWasThrown({ actualArgs }: { actualArgs: any[] }) {
  expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(actualArgs);
}

describe('createSpyFromClass', () => {
  Given(() => {
    fakeValue = 'BOOM!';
    actualResult = null;
    fakeArgs = [];

    throwArgumentsErrorSpyFunction = spyOn(errorHandling, 'throwArgumentsError');
    fakeClassSpy = createSpyFromClass(FakeClass);
  });

  describe('GIVEN a synchronous method is being configured', () => {
    Given(() => {
      fakeClassSpy.getSyncValue.and.returnValue(fakeValue);
    });

    When(() => {
      actualResult = fakeClassSpy.getSyncValue();
    });

    Then(() => {
      expect(actualResult).toBe(fakeValue);
    });
  });

  describe('GIVEN a synchronous method is being manually configured', () => {
    Given(() => {
      fakeClassSpy = createSpyFromClass(FakeClass, ['customMethod']);
      (fakeClassSpy as any).customMethod.and.returnValue(fakeValue);
    });

    When(() => {
      actualResult = (fakeClassSpy as any).customMethod();
    });

    Then(() => {
      expect(actualResult).toBe(fakeValue);
    });
  });

  describe('GIVEN a synchronous method is being configured with specific parameters', () => {
    Given(() => {
      fakeArgs = [1, { a: 2 }];
      fakeClassSpy.getSyncValue.calledWith(...fakeArgs).returnValue(fakeValue);
    });

    describe('WHEN it is called with the expected parameters THEN return the value', () => {
      When(() => {
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs);
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe(`GIVEN another calledWith is configured
                WHEN method is called twice
                THEN return the correct value for each call`, () => {
      let actualResult2: any;
      let fakeArgs2: any[];
      let fakeValue2: any;
      Given(() => {
        actualResult2 = undefined;
        fakeValue2 = 'FAKE VALUE 2';
        fakeArgs2 = [3, 4];
        fakeClassSpy.getSyncValue.calledWith(...fakeArgs2).returnValue(fakeValue2);
      });

      When(() => {
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs);
        actualResult2 = fakeClassSpy.getSyncValue(...fakeArgs2);
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
        expect(actualResult2).toBe(fakeValue2);
      });
    });

    describe('WHEN called with the wrong parameters THEN DO NOT throw an error', () => {
      When(() => {
        actualResult = fakeClassSpy.getSyncValue(WRONG_VALUE);
      });

      Then(() => {
        expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
      });
    });
  });

  describe(`GIVEN a synchronous method is configured to throw on mismatch
            WHEN called with the wrong parameters
            THEN throw an error`, () => {
    Given(() => {
      fakeArgs = [1, { a: 2 }];
      fakeClassSpy.getSyncValue.mustBeCalledWith(...fakeArgs).returnValue(fakeValue);
    });
    When(() => {
      actualResult = fakeClassSpy.getSyncValue(WRONG_VALUE);
    });

    Then(() => {
      verifyArgumentsErrorWasThrown({
        actualArgs: [WRONG_VALUE],
      });
    });
  });

  describe(`GIVEN a synchronous method calledWith is configured to throw on mismatch
            WHEN called twice with the right parameters
            THEN DO NOT throw an error`, () => {
    let fakeArgs2: any[];
    Given(() => {
      fakeArgs = [1, { a: 2 }];
      fakeArgs2 = [1, { a: 3 }];
      fakeClassSpy.getSyncValue.mustBeCalledWith(...fakeArgs).returnValue(fakeValue);

      fakeClassSpy.getSyncValue.mustBeCalledWith(...fakeArgs2).returnValue(fakeValue);
    });

    describe(`WHEN called twice with the right parameters
             THEN DO NOT throw an error`, () => {
      When(() => {
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs);
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs2);
      });

      Then(() => {
        expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
      });
    });

    describe(`WHEN called second time with the wrong parameters
             THEN throw an error with the wrong value`, () => {
      When(() => {
        actualResult = fakeClassSpy.getSyncValue(...fakeArgs);
        actualResult = fakeClassSpy.getSyncValue(WRONG_VALUE);
      });

      Then(() => {
        verifyArgumentsErrorWasThrown({
          actualArgs: [WRONG_VALUE],
        });
      });
    });
  });

  describe('An example of how to write spies for abstract class', () => {
    let abstractClassSpy: Spy<FakeAbstractClass>;
    Given(() => {
      abstractClassSpy = createSpyFromClass(
        class SomeFakeClass extends FakeAbstractClass {}
      );
      abstractClassSpy.getSyncValue.and.returnValue('FAKE');
    });

    When(() => {
      actualResult = abstractClassSpy.getSyncValue();
    });

    Then(() => {
      expect(actualResult).toBe('FAKE');
    });
  });
});
