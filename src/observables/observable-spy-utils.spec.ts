import { createSpyFromClass } from '../create-spy-from-class';
import { FakeChildClass, FakeClass } from '../test-utils/fake-classes-to-test';
import { take } from 'rxjs/operators';
import { Spy } from '../spy.types';
import * as errorHandling from '../errors/error-handling';

let fakeClassSpy: Spy<FakeClass>;
let fakeChildClassSpy: Spy<FakeChildClass>;
let fakeValue: any;
let actualResult: any;
let actualError: any;
let fakeArgs: any[];
let completed: boolean;
const WRONG_VALUE = 'WRONG VALUE';
let throwArgumentsErrorSpyFunction: jasmine.Spy;

function verifyArgumentsErrorWasThrown({ actualArgs }: { actualArgs: any[] }) {
  expect(throwArgumentsErrorSpyFunction).toHaveBeenCalledWith(actualArgs);
}

describe('createSpyFromClass', () => {
  Given(() => {
    fakeValue = 'BOOM!';
    actualResult = null;
    actualError = null;
    completed = false;
    fakeArgs = [];

    throwArgumentsErrorSpyFunction = spyOn(errorHandling, 'throwArgumentsError');
  });

  describe('GIVEN a fake Class', () => {
    Given(() => {
      fakeClassSpy = createSpyFromClass(FakeClass);
    });

    describe('WHEN calling an observable returning method', () => {
      When(() => {
        fakeClassSpy
          .observableMethod()
          .pipe(take(1))
          .subscribe(
            result => (actualResult = result),
            error => (actualError = error),
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

      describe('GIVEN throwWith is configured THEN emit an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod.and.throwWith(fakeValue);
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
        const observable = fakeClassSpy.observableMethod(...fakeArgs);
        if (observable) {
          observable
            .pipe(take(1))
            .subscribe(
              (result: any) => (actualResult = result),
              (error: any) => (actualError = error),
              () => (completed = true)
            );
        }
      });

      describe('GIVEN calledWith of nextWith is configured with the right params ', () => {
        Given(() => {
          fakeClassSpy.observableMethod.calledWith(...fakeArgs).nextWith(fakeValue);
        });
        describe('GIVEN it is configured once THEN emit the next event', () => {
          Then(() => {
            expect(actualResult).toBe(fakeValue);
          });
        });

        describe(`GIVEN another calledWith is configured
                  WHEN method is called twice
                  THEN return the correct value for each call`, () => {
          interface FakeType {
            name: string;
          }
          let actualResult2: any;
          let fakeArgs2: any[];
          let fakeValue2: FakeType;
          Given(() => {
            actualResult2 = undefined;
            fakeValue2 = { name: 'FAKE VALUE 2' };
            fakeArgs2 = [3, 4];
            fakeClassSpy.observableMethod.calledWith(...fakeArgs2).nextWith(fakeValue2);
          });

          When(() => {
            fakeClassSpy
              .observableMethod(...fakeArgs2)
              .pipe(take(1))
              .subscribe((result: any) => (actualResult2 = result));
          });

          Then(() => {
            expect(actualResult).toBe(fakeValue);
            expect(actualResult2).toBe(fakeValue2);
          });
        });
      });

      describe('GIVEN calledWith of nextWith is configured with wrong params THEN do not throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod.calledWith(WRONG_VALUE).nextWith(fakeValue);
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
        });
      });

      describe('GIVEN calledWith of nextWith is configured with the wrong params THEN throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(WRONG_VALUE)
            .nextWith(fakeValue)
            .throwOnMismatch();
        });

        Then(() => {
          verifyArgumentsErrorWasThrown({
            actualArgs: fakeArgs
          });
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

      describe('GIVEN calledWith of nextOneTimeWith is configured with wrong params THEN do not throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(WRONG_VALUE)
            .nextOneTimeWith(fakeValue);
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
        });
      });

      describe('GIVEN calledWith of nextOneTimeWith is configured with the wrong params THEN throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(WRONG_VALUE)
            .nextOneTimeWith(fakeValue)
            .throwOnMismatch();
        });

        Then(() => {
          verifyArgumentsErrorWasThrown({
            actualArgs: fakeArgs
          });
        });
      });

      describe('GIVEN calledWith of throwWith is configured with the right params THEN emit an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod.calledWith(...fakeArgs).throwWith(fakeValue);
        });

        Then(() => {
          expect(actualError).toBe(fakeValue);
        });
      });

      describe('GIVEN calledWith of throwWith is configured with wrong params THEN do not throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod.calledWith(WRONG_VALUE).throwWith(fakeValue);
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
        });
      });

      describe('GIVEN calledWith of throwWith is configured with the wrong params THEN throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(WRONG_VALUE)
            .throwWith(fakeValue)
            .throwOnMismatch();
        });

        Then(() => {
          verifyArgumentsErrorWasThrown({
            actualArgs: fakeArgs
          });
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

      describe('GIVEN calledWith of complete is configured with wrong params THEN do not throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod.calledWith(WRONG_VALUE).complete();
        });

        Then(() => {
          expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
        });
      });

      describe('GIVEN calledWith of complete is configured with the wrong params THEN throw an error', () => {
        Given(() => {
          fakeClassSpy.observableMethod
            .calledWith(WRONG_VALUE)
            .complete()
            .throwOnMismatch();
        });

        Then(() => {
          verifyArgumentsErrorWasThrown({
            actualArgs: fakeArgs
          });
        });
      });
    });

    describe('WHEN calling a Subject returning method', () => {
      Given(() => {
        fakeClassSpy.subjectMethod.and.nextWith(fakeValue);
      });

      When(() => {
        fakeClassSpy
          .subjectMethod()
          .pipe(take(1))
          .subscribe((result: any) => (actualResult = result));
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
        fakeChildClassSpy
          .anotherObservableMethod()
          .subscribe(result => (actualResult = result))
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
        fakeChildClassSpy
          .observableMethod()
          .subscribe(result => (actualResult = result))
          .unsubscribe();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });
  });
});
