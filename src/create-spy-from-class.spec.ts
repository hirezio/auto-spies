import { createSpyFromClass } from './create-spy-from-class';
import { FakeChildClass, FakeClass } from './fake-classes-to-test';
import { take } from 'rxjs/operators';
import { Spy } from './spy-types';
import * as errorHandling from './error-handling';

let fakeClassSpy: Spy<FakeClass>;
let fakeChildClassSpy: Spy<FakeChildClass>;
let fakeValue: any;
let actualResult: any;
let actualError: any;
let fakeArgs: any[];
let completed: boolean;
const WRONG_VALUE = 'WRONG VALUE';
let throwArgumentsErrorSpyFunction: jasmine.Spy;

describe('createSpyFromClass', () => {
  Given(() => {
    fakeValue = 'BOOM!';
    actualResult = null;
    actualError = null;
    completed = false;

    throwArgumentsErrorSpyFunction = spyOn(
      errorHandling,
      'throwArgumentsError'
    );
  });

  describe('GIVEN a fake Class', () => {

    Given(() => {
      fakeClassSpy = createSpyFromClass(FakeClass);
    });

    describe('GIVEN a synchronous method is being configured THEN return the value configured', () => {
      Given(() => {
        fakeClassSpy.syncMethod.and.returnValue(fakeValue);
      });

      When(() => {
        actualResult = fakeClassSpy.syncMethod();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('GIVEN a synchronous method is being configured with specific parameters', () => {
      Given(() => {
        fakeArgs = [1, { a: 2 }];
        fakeClassSpy.syncMethod.calledWith(...fakeArgs).returnValue(fakeValue);
      });

      describe('WHEN it is called with the expected parameters THEN return the value', () => {
        When(() => {
          actualResult = fakeClassSpy.syncMethod(...fakeArgs);
        });

        Then(() => {
          expect(actualResult).toBe(fakeValue);
        });
      });

      describe('WHEN called with the wrong parameters THEN throw an error', () => {
        When(() => {
          actualResult = fakeClassSpy.syncMethod(WRONG_VALUE);
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(
            fakeArgs,
            [WRONG_VALUE]
          );
        });
      });
    });

    describe('WHEN promise returning method is called', () => {
      When((done) => {

        fakeClassSpy.promiseMethod()
          .then(result => {
            actualResult = result;
            done();
          })
          .catch(error => {
            actualError = error;
            done();
          });
      });

      describe('should be able to fake resolve', () => {
        Given(() => {
          fakeClassSpy.promiseMethod.and.resolveWith(fakeValue);
        });
        Then(() => {
          expect(actualResult).toBe(fakeValue);
        });
      });

      describe('should be able to fake reject', () => {
        Given(() => {
          fakeClassSpy.promiseMethod.and.rejectWith(fakeValue);
        });
        Then(() => {
          expect(actualError).toBe(fakeValue);
        });
      });

    });

    describe('WHEN promise returning method is called with exact params ', () => {
      Given(() => {
        fakeArgs = [1, 2];
      });

      When((done = () => {}) => {
        fakeClassSpy
          .promiseMethod(...fakeArgs)
          .then((result: any) => {
            actualResult = result;
            done();
          })
          .catch((error: any) => {
            actualError = error;
            done();
          });
      });

      describe('GIVEN calledWith of resolveWith is configured with exact params THEN resolve with value', () => {
        Given(() => {
          fakeClassSpy.promiseMethod
            .calledWith(...fakeArgs)
            .resolveWith(fakeValue);
        });

        Then(() => {
          expect(actualResult).toBe(fakeValue);
        });
      });

      describe('GIVEN calledWith of resolveWith is configured with different params THEN throw an error', () => {
        Given(() => {
          fakeClassSpy.promiseMethod
            .calledWith(WRONG_VALUE)
            .resolveWith(fakeValue);
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(
            [WRONG_VALUE],
            fakeArgs
          );
        });
      });

      describe('GIVEN calledWith of rejectWith is configured with exact params THEN reject with value', () => {
        Given(() => {
          fakeClassSpy.promiseMethod
            .calledWith(...fakeArgs)
            .rejectWith(fakeValue);
        });

        Then(() => {
          expect(actualError).toBe(fakeValue);
        });
      });

      describe('GIVEN calledWith of rejectWith is configured with different params THEN should throw an error', () => {
        Given(() => {
          fakeClassSpy.promiseMethod
            .calledWith(WRONG_VALUE)
            .rejectWith(fakeValue);
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(
            [WRONG_VALUE],
            fakeArgs
          );
        });
      });
    });

    describe('GIVEN promise method names list configured', () => {

      Given(() => {
        fakeClassSpy = createSpyFromClass(FakeClass, ['providedPromiseMethod']);
        fakeClassSpy.providedPromiseMethod.and.resolveWith(fakeValue);
      });

      When((done) => {

        fakeClassSpy.providedPromiseMethod()
          .then(result => {
            actualResult = result;
            done();
          })
          .catch(error => {
            actualError = error;
            done();
          });
      });
      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('WHEN calling an observable returning method', () => {

      When(() => {
        fakeClassSpy.observableMethod()
          .pipe(
            take(1)
          )
          .subscribe(
            result => actualResult = result,
            error => actualError = error,
            () => (completed = true)
          );
      });

      describe('GIVEN nextWith is configured THEN emit the next event', () => {
        Given(() => {
          fakeClassSpy.observableMethod.and.nextWith(fakeValue);
        });

        Then(() => {

          expect(actualResult).toBe(fakeValue);
        });
      });

      describe('GIVEN nextOneTimeWith is configured THEN emit the next event', () => {
        Given(() => {
          fakeClassSpy.observableMethod.and.nextOneTimeWith(fakeValue);
        });

        Then(() => {
          expect(actualResult).toBe(fakeValue);
          expect(completed).toBeTruthy();
        });
      });

      describe('GIVEN nextWithError is configured THEN emit an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod.and.nextWithError(fakeValue);
        });

        Then(() => {
          expect(actualError).toBe(fakeValue);
        });
      });

      describe('GIVEN complete is configured THEN complete the Observable', () => {
        Given(() => {
          fakeClassSpy.observableMethod.and.complete();
        });

        Then(() => {
          expect(completed).toBe(true);
        });
      });

    });

    describe('WHEN Observable returning method is called with exact params', () => {
      Given(() => {
        fakeArgs = [1, 2];
      });

      When(() => {
        fakeClassSpy
          .observableMethod(...fakeArgs)
          .pipe(take(1))
          .subscribe(
            (result: any) => (actualResult = result),
            (error: any) => (actualError = error),
            () => (completed = true)
          );
      });

      describe('GIVEN calledWith of nextWith is configured with the right params THEN emit the next event', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(...fakeArgs)
            .nextWith(fakeValue);
        });

        Then(() => {
          expect(actualResult).toBe(fakeValue);
        });
      });

      describe('GIVEN calledWith of nextWith is configured with the wrong params THEN throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(WRONG_VALUE)
            .nextWith(fakeValue);
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(
            ['WRONG VALUE'],
            fakeArgs
          );
        });
      });

      describe('GIVEN calledWith of nextOneTimeWith configured with the right params THEN emit the next event', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(...fakeArgs)
            .nextOneTimeWith(fakeValue);
        });

        Then(() => {
          expect(actualResult).toBe(fakeValue);
          expect(completed).toBeTruthy();
        });
      });

      describe('GIVEN calledWith of nextOneTimeWith is configured with the wrong params THEN throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(WRONG_VALUE)
            .nextOneTimeWith(fakeValue);
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(
            ['WRONG VALUE'],
            fakeArgs
          );
        });
      });

      describe('GIVEN calledWith of nextWithError is configured with the right params THEN emit an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(...fakeArgs)
            .nextWithError(fakeValue);
        });

        Then(() => {
          expect(actualError).toBe(fakeValue);
        });
      });

      describe('GIVEN calledWith of nextWithError is configured with the wrong params THEN throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(WRONG_VALUE)
            .nextWithError(fakeValue);
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(
            ['WRONG VALUE'],
            fakeArgs
          );
        });
      });

      describe('GIVEN calledWith of complete is configured with the right params THEN complete successfully', () => {
        Given(() => {
          fakeClassSpy.observableMethod.calledWith(...fakeArgs).complete();
        });

        Then(() => {
          expect(completed).toBeTruthy();
        });
      });

      describe('GIVEN calledWith of complete is configured with the wrong params THEN throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod.calledWith(WRONG_VALUE).complete();
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(
            ['WRONG VALUE'],
            fakeArgs
          );
        });
      });
    });

    describe('GIVEN Observable method names list configured', () => {

      Given(() => {
        fakeClassSpy = createSpyFromClass(FakeClass, null, ['providedObservableMethod']);
        fakeClassSpy.providedObservableMethod.and.nextWith(fakeValue);
      });
      When(() => {
        fakeClassSpy.providedObservableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });
      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

  });

  describe('GIVEN a fake child Class', () => {
    Given(() => {
      fakeChildClassSpy = createSpyFromClass(FakeChildClass);
    });
    describe('Observable method works correctly', () => {
      Given(() => {
        fakeChildClassSpy.anotherObservableMethod.and.nextWith(fakeValue);
      });

      When(() => {
        fakeChildClassSpy.anotherObservableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('parent methods works correctly', () => {
      Given(() => {
        fakeChildClassSpy.observableMethod.and.nextWith(fakeValue);
      });

      When(() => {
        fakeChildClassSpy.observableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });
  });

});
