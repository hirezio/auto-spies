import { errorHandler } from '@hirez_io/auto-spies-core';
import { merge, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';
import { Spy } from '../jest-auto-spies.types';
import { FakeClass, FakeChildClass } from './fake-classes-to-test';
import { createSpyFromClass } from '../create-spy-from-class';

let fakeClassSpy: Spy<FakeClass>;
const FAKE_VALUE = 'FAKE EMITTED VALUE';
const WRONG_VALUE = 'WRONG VALUE';
let fakeArgs: any[];
let errorIsExpected: boolean;
let observerSpy: SubscriberSpy<any>;
let throwArgumentsErrorSpyFunction: jest.SpyInstance<any>;

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

describe('createSpyFromClass - Observables', () => {
  Given(() => {
    fakeArgs = [];
    errorIsExpected = false;

    throwArgumentsErrorSpyFunction = jest
      .spyOn(errorHandler, 'throwArgumentsError')
      .mockImplementation();
  });

  describe('GIVEN a fake Class is auto spied on', () => {
    Given(() => {
      fakeClassSpy = createSpyFromClass(FakeClass);
    });

    describe('WHEN calling an observable returning method', () => {
      When(() => {
        observerSpy = subscribeSpyTo(fakeClassSpy.getObservable(), {
          expectErrors: errorIsExpected,
        });
      });

      describe('GIVEN nextWith is configured', () => {
        Given(() => {
          fakeClassSpy.getObservable.nextWith(FAKE_VALUE);
        });

        Then('emit the correct value', () => {
          expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
        });
      });

      describe('GIVEN nextOneTimeWith is configured', () => {
        Given(() => {
          fakeClassSpy.getObservable.nextOneTimeWith(FAKE_VALUE);
        });

        Then('emit the correct value AND complete the observable', () => {
          expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
          expect(observerSpy.receivedComplete()).toBeTruthy();
        });
      });

      describe('GIVEN throwWith is configured', () => {
        Given(() => {
          errorIsExpected = true;
          fakeClassSpy.getObservable.throwWith(FAKE_VALUE);
        });

        Then('emit the correct error', () => {
          expect(observerSpy.getError()).toBe(FAKE_VALUE);
        });
      });

      describe('GIVEN complete is configured', () => {
        Given(() => {
          fakeClassSpy.getObservable.complete();
        });

        Then('complete the Observable', () => {
          expect(observerSpy.receivedComplete()).toBe(true);
        });
      });

      describe('GIVEN returnSubject is configured', () => {
        let subject: Subject<any>;
        Given(() => {
          subject = fakeClassSpy.getObservable.returnSubject();
        });

        Then('do NOT emit', () => {
          expect(observerSpy.getLastValue()).toBeUndefined();
        });

        describe('GIVEN subject emits', () => {
          Given(() => {
            subject.next(FAKE_VALUE);
          });

          Then('emit the correct value', () => {
            expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
          });
        });
      });
    });

    describe('nextWithValues', () => {
      When(() => {
        observerSpy = subscribeSpyTo(fakeClassSpy.getObservable(), {
          expectErrors: errorIsExpected,
        });
      });

      describe('GIVEN nextWithValues is configured with values and complete', () => {
        Given(() => {
          fakeClassSpy.getObservable.nextWithValues([
            { value: 'FAKE_VALUE1' },
            { value: 'FAKE_VALUE2', delay: 1 },
            { value: 'FAKE_VALUE3' },
            { complete: true },
          ]);
        });

        Then('emit the correct values in order', async () => {
          await observerSpy.onComplete();

          expect(observerSpy.getValues()).toEqual([
            'FAKE_VALUE1',
            'FAKE_VALUE2',
            'FAKE_VALUE3',
          ]);
        });
      });

      describe('GIVEN nextWithValues is configured with delayed complete', () => {
        Given(() => {
          fakeClassSpy.getObservable.nextWithValues([
            { value: 'FAKE_VALUE1' },
            { complete: true, delay: 1 },
            { value: 'FAKE_VALUE2' },
          ]);
        });

        Then('emit the correct values in order', async () => {
          await observerSpy.onComplete();

          expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1']);
        });
      });

      describe('GIVEN nextWithValues is configured with complete set to false', () => {
        Given(() => {
          fakeClassSpy.getObservable.nextWithValues([
            { value: 'FAKE_VALUE1' },
            { complete: false },
          ]);
        });

        Then('emit the correct value and do not complete', () => {
          expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1']);
          expect(observerSpy.receivedComplete()).toBeFalsy();
        });
      });

      describe('GIVEN nextWithValues is configured to throw', () => {
        Given(() => {
          errorIsExpected = true;

          fakeClassSpy.getObservable.nextWithValues([
            { value: 'FAKE_VALUE1' },
            { errorValue: 'FAKE_ERROR' },
            { value: 'FAKE_VALUE3' },
          ]);
        });

        Then('emit the correct values in order', async () => {
          await observerSpy.onError();

          expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1']);
          expect(observerSpy.getError()).toEqual('FAKE_ERROR');
        });
      });

      describe('GIVEN nextWithValues is configured to throw with delay', () => {
        Given(() => {
          errorIsExpected = true;

          fakeClassSpy.getObservable.nextWithValues([
            { value: 'FAKE_VALUE1' },
            { errorValue: 'FAKE_ERROR', delay: 1 },
            { value: 'FAKE_VALUE3' },
          ]);
        });

        Then('emit the correct values in order', async () => {
          await observerSpy.onError();

          expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1']);
          expect(observerSpy.getError()).toEqual('FAKE_ERROR');
        });
      });

      describe(`GIVEN nextWithValues is configured with values
                WHEN nextWith is called and then complete`, () => {
        Given(() => {
          fakeClassSpy.getObservable.nextWithValues([
            { value: 'FAKE_VALUE1' },
            { value: 'FAKE_VALUE2' },
            { value: 'FAKE_VALUE3' },
          ]);
        });

        When(() => {
          fakeClassSpy.getObservable.nextWith('FAKE_VALUE4');
          fakeClassSpy.getObservable.complete();
        });

        Then('should be able to continue emitting after the default values', async () => {
          await observerSpy.onComplete();

          expect(observerSpy.getValues()).toEqual([
            'FAKE_VALUE1',
            'FAKE_VALUE2',
            'FAKE_VALUE3',
            'FAKE_VALUE4',
          ]);
        });
      });
    });

    describe('nextWithPerCall', () => {
      describe(`GIVEN nextWithPerCall is configured with 2 values (first one with a delay)
                WHEN calling an observable returning method TWICE`, () => {
        Given(() => {
          fakeClassSpy.getObservable.nextWithPerCall([
            { value: FAKE_VALUE, delay: 2 }, // <-- first call
            { value: 'SECOND_FAKE_VALUE' }, // <-- second call
          ]);
        });

        When(async () => {
          const firstCall = fakeClassSpy.getObservable();
          const secondCall = fakeClassSpy.getObservable();
          const mergedObservables = merge(firstCall, secondCall).pipe(take(2));
          observerSpy = subscribeSpyTo(mergedObservables);

          await observerSpy.onComplete();
        });

        Then('the first value should appear in second place because of the delay', () => {
          expect(observerSpy.getValues()).toEqual(['SECOND_FAKE_VALUE', FAKE_VALUE]);
        });
      });

      describe(`GIVEN nextWithPerCall is configured not to complete
                WHEN subscribing and manually emitting via the returned subject`, () => {
        let returnedSubject: Subject<any>;
        Given(() => {
          const returnedSubjects = fakeClassSpy.getObservable.nextWithPerCall([
            { value: FAKE_VALUE, doNotComplete: true },
          ]);

          returnedSubject = returnedSubjects[0];
        });

        When(async () => {
          observerSpy = subscribeSpyTo(fakeClassSpy.getObservable());
          returnedSubject.next('SECOND_FAKE_VALUE');
          returnedSubject.complete();
        });

        Then('should emit both values', () => {
          expect(observerSpy.getValues()).toEqual([FAKE_VALUE, 'SECOND_FAKE_VALUE']);
        });
      });

      describe(`GIVEN nextWithPerCall is configured with a value
                WHEN subscribing`, () => {
        Given(() => {
          fakeClassSpy.getObservable.nextWithPerCall([{ value: FAKE_VALUE }]);
        });

        When(async () => {
          observerSpy = subscribeSpyTo(fakeClassSpy.getObservable());
        });

        Then('should should complete by default', () => {
          expect(observerSpy.receivedComplete()).toBeTruthy();
        });
      });
    });

    describe('WHEN Observable returning method is called with exact params', () => {
      let expectedMethodName: string;
      Given(() => {
        fakeArgs = [1, 2];
      });

      When(() => {
        const observable = fakeClassSpy.getObservable(...fakeArgs);
        if (observable) {
          observerSpy = subscribeSpyTo(observable, { expectErrors: errorIsExpected });
        }
      });

      describe('GIVEN calledWith of nextWith is configured with the right params', () => {
        Given(() => {
          fakeClassSpy.getObservable.calledWith(...fakeArgs).nextWith(FAKE_VALUE);
        });
        Then('emit the correct value', () => {
          expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
        });
      });

      describe(`GIVEN calledWith is configured twice with different values
                WHEN method is called twice`, () => {
        interface FakeType {
          name: string;
        }
        let fakeArgs2: any[];
        let FAKE_VALUE2: FakeType;
        let observerSpy2: SubscriberSpy<any>;

        Given(() => {
          FAKE_VALUE2 = { name: 'FAKE VALUE 2' };
          fakeArgs2 = [3, 4];
          fakeClassSpy.getObservable.calledWith(...fakeArgs).nextWith(FAKE_VALUE);
          fakeClassSpy.getObservable.calledWith(...fakeArgs2).nextWith(FAKE_VALUE2);
        });

        When(() => {
          observerSpy2 = subscribeSpyTo(fakeClassSpy.getObservable(...fakeArgs2));
        });

        Then('return the correct value for each call', () => {
          expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
          expect(observerSpy2.getLastValue()).toBe(FAKE_VALUE2);
        });
      });

      describe('GIVEN calledWith of nextWith is configured with wrong params', () => {
        Given(() => {
          fakeClassSpy.getObservable.calledWith(WRONG_VALUE).nextWith(FAKE_VALUE);
        });

        Then('do NOT throw an error', () => {
          expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
        });
      });

      describe('GIVEN calledWith of nextWith is configured with the wrong params', () => {
        Given(() => {
          expectedMethodName = 'getObservable';
          fakeClassSpy.getObservable.mustBeCalledWith(WRONG_VALUE).nextWith(FAKE_VALUE);
        });

        Then('throw an error', () => {
          verifyArgumentsErrorWasThrown({
            expectedMethodName,
            actualArgs: fakeArgs,
          });
        });
      });

      describe('GIVEN calledWith of nextOneTimeWith configured with the right params', () => {
        Given(() => {
          fakeClassSpy.getObservable.calledWith(...fakeArgs).nextOneTimeWith(FAKE_VALUE);
        });

        Then('emit the correct event and complete', () => {
          expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
          expect(observerSpy.receivedComplete()).toBeTruthy();
        });
      });

      describe('GIVEN calledWith of nextOneTimeWith is configured with wrong params', () => {
        Given(() => {
          fakeClassSpy.getObservable.calledWith(WRONG_VALUE).nextOneTimeWith(FAKE_VALUE);
        });

        Then('do NOT throw an error', () => {
          expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
        });
      });

      describe('GIVEN calledWith of nextOneTimeWith is configured with the wrong params', () => {
        Given(() => {
          expectedMethodName = 'getObservable';
          fakeClassSpy.getObservable
            .mustBeCalledWith(WRONG_VALUE)
            .nextOneTimeWith(FAKE_VALUE);
        });

        Then('throw an error', () => {
          verifyArgumentsErrorWasThrown({
            expectedMethodName,
            actualArgs: fakeArgs,
          });
        });
      });

      describe('GIVEN calledWith of throwWith is configured with the right params', () => {
        Given(() => {
          errorIsExpected = true;
          fakeClassSpy.getObservable.calledWith(...fakeArgs).throwWith(FAKE_VALUE);
        });

        Then('emit the correct error', () => {
          expect(observerSpy.getError()).toBe(FAKE_VALUE);
        });
      });

      describe('GIVEN calledWith of throwWith is configured with wrong params', () => {
        Given(() => {
          fakeClassSpy.getObservable.calledWith(WRONG_VALUE).throwWith(FAKE_VALUE);
        });

        Then('do NOT throw an error', () => {
          expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
        });
      });

      describe('GIVEN calledWith of throwWith is configured with the wrong params', () => {
        Given(() => {
          expectedMethodName = 'getObservable';
          fakeClassSpy.getObservable.mustBeCalledWith(WRONG_VALUE).throwWith(FAKE_VALUE);
        });

        Then('throw an error', () => {
          verifyArgumentsErrorWasThrown({
            expectedMethodName,
            actualArgs: fakeArgs,
          });
        });
      });

      describe('GIVEN calledWith of complete is configured with the right params', () => {
        Given(() => {
          fakeClassSpy.getObservable.calledWith(...fakeArgs).complete();
        });

        Then('complete successfully', () => {
          expect(observerSpy.receivedComplete()).toBeTruthy();
        });
      });

      describe('GIVEN calledWith of complete is configured with wrong params', () => {
        Given(() => {
          fakeClassSpy.getObservable.calledWith(WRONG_VALUE).complete();
        });

        Then('do not throw an error', () => {
          expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
        });
      });

      describe('GIVEN mustBeCalledWith of complete is configured with the wrong params', () => {
        Given(() => {
          expectedMethodName = 'getObservable';
          fakeClassSpy.getObservable.mustBeCalledWith(WRONG_VALUE).complete();
        });

        Then('throw an error', () => {
          verifyArgumentsErrorWasThrown({
            expectedMethodName,
            actualArgs: fakeArgs,
          });
        });
      });

      describe('GIVEN calledWith of returnSubject is configured with the right params', () => {
        Given(() => {
          const subject = fakeClassSpy.getObservable
            .calledWith(...fakeArgs)
            .returnSubject();
          subject.next(FAKE_VALUE);
        });

        Then('emit the correct value', () => {
          expect(observerSpy.getLastValue()).toEqual(FAKE_VALUE);
        });
      });

      describe('GIVEN calledWith of returnSubject is configured with wrong params', () => {
        Given(() => {
          fakeClassSpy.getObservable.calledWith(WRONG_VALUE).returnSubject();
        });

        Then('do NOT throw an error', () => {
          expect(throwArgumentsErrorSpyFunction).not.toHaveBeenCalled();
        });
      });

      describe(`GIVEN mustBeCalledWith of returnSubject is configured with the wrong params`, () => {
        Given(() => {
          expectedMethodName = 'getObservable';
          fakeClassSpy.getObservable.mustBeCalledWith(WRONG_VALUE).returnSubject();
        });

        Then('throw an error', () => {
          verifyArgumentsErrorWasThrown({
            expectedMethodName,
            actualArgs: fakeArgs,
          });
        });
      });
    });

    describe(`GIVEN a Subject returning method is configured to emit
              WHEN calling that method`, () => {
      Given(() => {
        fakeClassSpy.getSubject.nextWith(FAKE_VALUE);
      });

      When(() => {
        observerSpy = subscribeSpyTo(fakeClassSpy.getSubject());
      });

      Then('emit the correct value', () => {
        expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
      });
    });

    describe(`GIVEN class spy is configured with a manual observable property
              WHEN subscribing to an observable property`, () => {
      Given(() => {
        fakeClassSpy = createSpyFromClass(FakeClass, {
          observablePropsToSpyOn: ['observableProp'],
        });
      });

      When(() => {
        observerSpy = subscribeSpyTo(fakeClassSpy.observableProp, {
          expectErrors: errorIsExpected,
        });
      });

      describe(`GIVEN observable spy is configured to emit`, () => {
        Given(() => {
          fakeClassSpy.observableProp.nextWith(FAKE_VALUE);
        });

        Then('return value should be the fake value', () => {
          expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
        });
      });

      describe(`GIVEN observable spy is configured to emit and complete`, () => {
        Given(() => {
          fakeClassSpy.observableProp.nextOneTimeWith(FAKE_VALUE);
        });

        Then('return value should be the fake value and complete', () => {
          expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
          expect(observerSpy.receivedComplete()).toBe(true);
        });
      });

      describe(`GIVEN observable spy is configured to throw`, () => {
        Given(() => {
          errorIsExpected = true;
          fakeClassSpy.observableProp.throwWith(FAKE_VALUE);
        });

        Then('return error value should be the fake value', () => {
          expect(observerSpy.getError()).toBe(FAKE_VALUE);
        });
      });

      describe(`GIVEN observable spy is configured to complete`, () => {
        Given(() => {
          fakeClassSpy.observableProp.complete();
        });

        Then('it should complete', () => {
          expect(observerSpy.receivedComplete()).toBe(true);
        });
      });

      describe(`GIVEN observable spy is configured to return the subject and emit`, () => {
        Given(() => {
          const subject = fakeClassSpy.observableProp.returnSubject();
          subject.next(FAKE_VALUE);
        });

        Then('return value should be the fake value', () => {
          expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
        });
      });

      describe(`GIVEN observable spy is configured to emit multiple values`, () => {
        Given(() => {
          fakeClassSpy.observableProp.nextWithValues([
            { value: FAKE_VALUE + '1' },
            { value: FAKE_VALUE + '2' },
            { value: FAKE_VALUE + '3' },
            { complete: true },
          ]);
        });

        Then('return value should be the fake values', async () => {
          await observerSpy.onComplete();
          expect(observerSpy.getValues()).toEqual([
            FAKE_VALUE + '1',
            FAKE_VALUE + '2',
            FAKE_VALUE + '3',
          ]);
        });
      });
    });

    describe(`GIVEN class spy with a getter returning an observable
             WHEN calling nextWith with fake value and subscribing`, () => {
      Given(() => {
        fakeClassSpy = createSpyFromClass(FakeClass, {
          observablePropsToSpyOn: ['observablePropAsGetter'],
        });
        fakeClassSpy.observablePropAsGetter.nextWith(FAKE_VALUE);
      });

      When(() => {
        observerSpy = subscribeSpyTo(fakeClassSpy.observablePropAsGetter, {
          expectErrors: errorIsExpected,
        });
      });

      Then('return value should be the fake value', () => {
        expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
      });
    });

    describe(`GIVEN class spy with a subject property
             WHEN calling nextWith with fake value and subscribing`, () => {
      Given(() => {
        fakeClassSpy = createSpyFromClass(FakeClass, {
          observablePropsToSpyOn: ['subjectProp'],
        });
        fakeClassSpy.subjectProp.nextWith(FAKE_VALUE);
      });

      When(() => {
        observerSpy = subscribeSpyTo(fakeClassSpy.subjectProp, {
          expectErrors: errorIsExpected,
        });
      });

      Then('return value should be the fake value', () => {
        expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
      });
    });

    describe(`GIVEN calledWith is configured to return different value per call
                AND configured with the right params`, () => {
      Given(() => {
        fakeClassSpy.getObservable
          .calledWith(...fakeArgs)
          .nextWithPerCall([{ value: FAKE_VALUE }, { value: `FAKE_VALUE2` }]);
      });

      When(async () => {
        const firstCall = fakeClassSpy.getObservable(...fakeArgs);
        const secondCall = fakeClassSpy.getObservable(...fakeArgs);
        const mergedObservables = merge(firstCall, secondCall).pipe(take(2));
        observerSpy = subscribeSpyTo(mergedObservables);

        await observerSpy.onComplete();
      });

      Then('emit the correct values', () => {
        expect(observerSpy.getValues()).toEqual([FAKE_VALUE, 'FAKE_VALUE2']);
      });
    });

    describe(`GIVEN mustBeCalledWith is configured to return different value per call
                AND configured with the right params`, () => {
      Given(() => {
        fakeClassSpy.getObservable
          .mustBeCalledWith(...fakeArgs)
          .nextWithPerCall([{ value: FAKE_VALUE }, { value: `FAKE_VALUE2` }]);
      });

      When(async () => {
        const firstCall = fakeClassSpy.getObservable(...fakeArgs);
        const secondCall = fakeClassSpy.getObservable(...fakeArgs);
        const mergedObservables = merge(firstCall, secondCall).pipe(take(2));
        observerSpy = subscribeSpyTo(mergedObservables);

        await observerSpy.onComplete();
      });

      Then('emit the correct values', () => {
        expect(observerSpy.getValues()).toEqual([FAKE_VALUE, 'FAKE_VALUE2']);
      });
    });

    //
  });

  describe('GIVEN a fake child Class', () => {
    let fakeChildClassSpy: Spy<FakeChildClass>;

    Given(() => {
      fakeChildClassSpy = createSpyFromClass(FakeChildClass);
    });
    describe('Observable method works correctly', () => {
      Given(() => {
        fakeChildClassSpy.anotherObservableMethod.nextWith(FAKE_VALUE);
      });

      When(() => {
        observerSpy = subscribeSpyTo(fakeChildClassSpy.anotherObservableMethod());
      });

      Then(() => {
        expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
      });
    });

    describe('parent methods works correctly', () => {
      Given(() => {
        fakeChildClassSpy.getObservable.nextWith(FAKE_VALUE);
      });

      When(() => {
        observerSpy = subscribeSpyTo(fakeChildClassSpy.getObservable());
      });

      Then(() => {
        expect(observerSpy.getLastValue()).toBe(FAKE_VALUE);
      });
    });
  });
});
