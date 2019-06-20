import { createSpyFromClass } from '../create-spy-from-class';
import { FakeClass } from '../test-utils/fake-classes-to-test';
import { Spy } from '../spy.types';
import * as errorHandling from '../errors/error-handling';

let fakeClassSpy: Spy<FakeClass>;
let fakeValue: any;
let actualResult: any;
let actualError: any;
let fakeArgs: any[];
const WRONG_VALUE = 'WRONG VALUE';
let throwArgumentsErrorSpyFunction: jasmine.Spy;

function verifyArgumentsErrorWasThrown({ actualArgs }: { actualArgs: any[] }) {
  expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(actualArgs);
}

describe('createSpyFromClass - promises', () => {
  Given(() => {
    fakeValue = 'BOOM!';
    actualResult = null;
    actualError = null;
    fakeArgs = [];

    throwArgumentsErrorSpyFunction = spyOn(errorHandling, 'throwArgumentsError');

    fakeClassSpy = createSpyFromClass(FakeClass);
  });

  describe('WHEN a promise returning method is called', () => {
    When(async (done: any) => {
      try {
        actualResult = await fakeClassSpy.promiseMethod(...fakeArgs);
      } catch (error) {
        actualError = error;
      }
      done();
    });

    describe('THEN should be able to fake resolve', () => {
      Given(() => {
        fakeClassSpy.promiseMethod.and.resolveWith(fakeValue);
      });
      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('THEN should be able to fake reject', () => {
      Given(() => {
        fakeClassSpy.promiseMethod.and.rejectWith(fakeValue);
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

    When(async (done: any) => {
      try {
        actualResult = await fakeClassSpy.promiseMethod(...fakeArgs);
      } catch (error) {
        actualError = error;
      }
      done();
    });

    describe('GIVEN calledWith of resolveWith is configured with exact params', () => {
      Given(() => {
        fakeClassSpy.promiseMethod.calledWith(...fakeArgs).resolveWith(fakeValue);
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
          fakeClassSpy.promiseMethod.calledWith(...fakeArgs2).resolveWith(fakeValue2);
        });

        When(async (done: any) => {
          try {
            actualResult2 = await fakeClassSpy.promiseMethod(...fakeArgs2);
          } catch (error) {
            actualError = error;
          }
          done();
        });

        Then(() => {
          expect(actualResult).toBe(fakeValue);
          expect(actualResult2).toBe(fakeValue2);
        });
      });
    });

    describe('GIVEN calledWith of resolveWith is configured with wrong params THEN do not throw an error', () => {
      Given(() => {
        fakeClassSpy.promiseMethod.calledWith(...WRONG_VALUE).resolveWith(fakeValue);
      });

      Then(() => {
        expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
      });
    });

    describe(`GIVEN a calledWith of resolveWith is configured to throw on mismatch
            WHEN called with the wrong parameters
            THEN throw an error`, () => {
      Given(() => {
        fakeClassSpy.promiseMethod.mustBeCalledWith(WRONG_VALUE).resolveWith(fakeValue);
      });

      Then(() => {
        verifyArgumentsErrorWasThrown({
          actualArgs: fakeArgs
        });
      });
    });

    describe('GIVEN calledWith of rejectWith is configured with exact params THEN reject with value', () => {
      Given(() => {
        fakeClassSpy.promiseMethod.calledWith(...fakeArgs).rejectWith(fakeValue);
      });

      Then(() => {
        expect(actualError).toBe(fakeValue);
      });
    });

    describe('GIVEN calledWith of rejectWith is configured with wrong params THEN do not throw an error', () => {
      Given(() => {
        fakeClassSpy.promiseMethod.calledWith(...WRONG_VALUE).rejectWith(fakeValue);
      });

      Then(() => {
        expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
      });
    });

    describe(`GIVEN calledWith of rejectWith is configured to throw on mismatch
            WHEN called with the wrong parameters
            THEN throw an error`, () => {
      Given(() => {
        fakeClassSpy.promiseMethod.mustBeCalledWith(WRONG_VALUE).rejectWith(fakeValue);
      });

      Then(() => {
        verifyArgumentsErrorWasThrown({
          actualArgs: fakeArgs
        });
      });
    });
  });
});
