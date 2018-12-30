import { createSpyFromClass } from './create-spy-from-class';
import { FakeChildClass, FakeClass } from './fake-classes-to-test';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Spy } from './spy-types';

let fakeClassSpy: Spy<FakeClass>;
let fakeChildClassSpy: Spy<FakeChildClass>;
let fakeValue: any;
let actualResult: any;
let actualRejection: any;
let completed: boolean;

describe('createSpyFromClass', () => {
  Given(() => {
    fakeValue = 'BOOM!';
    actualResult = null;
    actualRejection = null;
    completed = false;
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

    describe('WHEN promise returning method is called', () => {
      When((done) => {

        fakeClassSpy.promiseMethod()
          .then(result => {
            actualResult = result;
            done();
          })
          .catch(error => {
            actualRejection = error;
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
          expect(actualRejection).toBe(fakeValue);
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
            actualRejection = error;
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
            error => actualRejection = error,
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
          expect(actualRejection).toBe(fakeValue);
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

    describe('Provided observables list', () => {

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

  describe('Fake Child Class', () => {
    Given(() => {
      fakeChildClassSpy = createSpyFromClass(FakeChildClass);
    });
    describe('Observable method', () => {
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

    describe('parent methods', () => {
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
