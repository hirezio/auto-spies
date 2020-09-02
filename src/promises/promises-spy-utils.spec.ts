import { createSpyFromClass } from '../create-spy-from-class';
import { FakeClass } from '../test-utils/fake-classes-to-test';
import { Spy } from '../auto-spies.types';
import * as errorHandling from '../errors/error-handling';

let fakeClassSpy: Spy<FakeClass>;
let fakeValue: any;
let actualResult: any;
let actualError: any;
let fakeArgs: any[];
const WRONG_VALUE = 'WRONG VALUE';
let throwArgumentsErrorSpyFunction: jasmine.Spy;
let errorIsExpected: boolean;

function verifyArgumentsErrorWasThrown({ actualArgs }: { actualArgs: any[] }) {
  expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(actualArgs);
}

describe('createSpyFromClass - promises', () => {
  Given(() => {
    fakeValue = 'FAKE PROMISE VALUE';
    actualResult = null;
    actualError = null;
    fakeArgs = [];
    errorIsExpected = false;

    throwArgumentsErrorSpyFunction = spyOn(errorHandling, 'throwArgumentsError');

    fakeClassSpy = createSpyFromClass(FakeClass);
  });

  describe('WHEN a promise returning method is called', () => {
    When(async () => {
      try {
        actualResult = await fakeClassSpy.getPromise(...fakeArgs);
      } catch (error) {
        if (!errorIsExpected) {
          throw error;
        }
        actualError = error;
      }
    });

    describe('THEN should be able to fake resolve', () => {
      Given(() => {
        fakeClassSpy.getPromise.and.resolveWith(fakeValue);
      });
      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('THEN should be able to fake reject', () => {
      Given(() => {
        errorIsExpected = true;
        fakeClassSpy.getPromise.and.rejectWith(fakeValue);
      });
      Then(() => {
        expect(actualError).toBe(fakeValue);
      });
    });
  });

  describe('WHEN a promise returning method is called with exact params ', () => {
    Given(() => {
      fakeArgs = [1, 2];
    });

    When(async () => {
      try {
        actualResult = await fakeClassSpy.getPromise(...fakeArgs);
      } catch (error) {
        if (!errorIsExpected) {
          throw error;
        }
        actualError = error;
      }
    });

    describe('GIVEN calledWith of resolveWith is configured with exact params', () => {
      Given(() => {
        fakeClassSpy.getPromise.calledWith(...fakeArgs).resolveWith(fakeValue);
      });
      describe('GIVEN it is configured once THEN resolve with value', () => {
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
          fakeClassSpy.getPromise.calledWith(...fakeArgs2).resolveWith(fakeValue2);
        });

        When(async () => {
          try {
            actualResult2 = await fakeClassSpy.getPromise(...fakeArgs2);
          } catch (error) {
            if (!errorIsExpected) {
              throw error;
            }
            actualError = error;
          }
        });

        Then(() => {
          expect(actualResult).toBe(fakeValue);
          expect(actualResult2).toBe(fakeValue2);
        });
      });
    });

    describe('GIVEN calledWith of resolveWith is configured with wrong params THEN do not throw an error', () => {
      Given(() => {
        fakeClassSpy.getPromise.calledWith(WRONG_VALUE).resolveWith(fakeValue);
      });

      Then(() => {
        expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
      });
    });

    describe(`GIVEN a calledWith of resolveWith is configured to throw on mismatch
            WHEN called with the wrong parameters
            THEN throw an error`, () => {
      Given(() => {
        fakeClassSpy.getPromise.mustBeCalledWith(WRONG_VALUE).resolveWith(fakeValue);
      });

      Then(() => {
        verifyArgumentsErrorWasThrown({
          actualArgs: fakeArgs,
        });
      });
    });

    describe('GIVEN calledWith of rejectWith is configured with exact params THEN reject with value', () => {
      Given(() => {
        errorIsExpected = true;
        fakeClassSpy.getPromise.calledWith(...fakeArgs).rejectWith(fakeValue);
      });

      Then(() => {
        expect(actualError).toBe(fakeValue);
      });
    });

    describe('GIVEN mustBeCalledWith of rejectWith is configured with exact params THEN reject with value', () => {
      Given(() => {
        errorIsExpected = true;
        fakeClassSpy.getPromise.mustBeCalledWith(...fakeArgs).rejectWith(fakeValue);
      });

      Then(() => {
        expect(actualError).toBe(fakeValue);
      });
    });

    describe('GIVEN calledWith of rejectWith is configured with wrong params THEN do not throw an error', () => {
      Given(() => {
        fakeClassSpy.getPromise.calledWith(WRONG_VALUE).rejectWith(fakeValue);
      });

      Then(() => {
        expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
      });
    });

    describe(`GIVEN calledWith of rejectWith is configured to throw on mismatch
            WHEN called with the wrong parameters
            THEN throw an error`, () => {
      Given(() => {
        fakeClassSpy.getPromise.mustBeCalledWith(WRONG_VALUE).rejectWith(fakeValue);
      });

      Then(() => {
        verifyArgumentsErrorWasThrown({
          actualArgs: fakeArgs,
        });
      });
    });
  });
});
