import { observable, Observable, ReplaySubject } from 'rxjs';
import { createObservableWithValues } from './create-observable-with-values';
import { SubscriberSpy, subscribeSpyTo } from '@hirez_io/observer-spy';

describe('createObservableWithValues', () => {
  let observableUnderTest: Observable<any>;
  let observerSpy: SubscriberSpy<any>;
  let errorIsExpected: boolean;

  Given(() => {
    errorIsExpected = false;
  });

  When(() => {
    observerSpy = subscribeSpyTo(observableUnderTest, { expectErrors: errorIsExpected });
  });

  describe('GIVEN observable configured with 2 values', () => {
    Given(() => {
      observableUnderTest = createObservableWithValues([
        {
          value: 'FAKE_VALUE1',
        },
        {
          value: 'FAKE_VALUE2',
        },
      ]);
    });

    When(() => {
      observerSpy = subscribeSpyTo(observableUnderTest);
    });

    Then('should emit the values in the correct order', () => {
      expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1', 'FAKE_VALUE2']);
    });
  });

  describe('GIVEN observable configured with a value and complete', () => {
    Given(() => {
      observableUnderTest = createObservableWithValues([
        {
          value: 'FAKE_VALUE1',
        },
        { complete: true },
      ]);
    });

    Then('should emit the value and complete', () => {
      expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1']);
      expect(observerSpy.receivedComplete()).toBeTruthy();
    });
  });

  describe('GIVEN observable configured with a value and complete set to false', () => {
    Given(() => {
      observableUnderTest = createObservableWithValues([
        {
          value: 'FAKE_VALUE1',
        },
        { complete: false },
      ]);
    });

    Then('should emit the value but not complete', () => {
      expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1']);
      expect(observerSpy.receivedComplete()).toBeFalsy();
    });
  });

  describe('GIVEN observable configured with a delayed value, normal value and a delayed complete', () => {
    Given(() => {
      observableUnderTest = createObservableWithValues([
        {
          value: 'FAKE_VALUE1',
          delay: 1,
        },
        {
          value: 'FAKE_VALUE2',
        },
        { complete: true, delay: 1 },
      ]);
    });

    Then('should emit the value and complete', async () => {
      await observerSpy.onComplete();
      expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1', 'FAKE_VALUE2']);
      expect(observerSpy.receivedComplete()).toBeTruthy();
    });
  });

  describe('GIVEN observable configured with a value and an error', () => {
    Given(() => {
      errorIsExpected = true;
      observableUnderTest = createObservableWithValues([
        {
          value: 'FAKE_VALUE1',
        },
        { errorValue: 'FAKE_ERROR' },
      ]);
    });

    Then('should emit the value and the error', () => {
      expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1']);
      expect(observerSpy.getError()).toEqual('FAKE_ERROR');
    });
  });

  describe('GIVEN observable configured with a value and an error with a delay', () => {
    Given(() => {
      errorIsExpected = true;
      observableUnderTest = createObservableWithValues([
        {
          value: 'FAKE_VALUE1',
        },
        { errorValue: 'FAKE_ERROR', delay: 1 },
      ]);
    });

    Then('should emit the value and the delayed error ', async () => {
      await observerSpy.onError();
      expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1']);
      expect(observerSpy.getError()).toEqual('FAKE_ERROR');
    });
  });

  describe('GIVEN observable configured with a value and to return the subject', () => {
    let controllerSubject: ReplaySubject<any>;
    Given(() => {
      errorIsExpected = true;
      const { values$, subject } = createObservableWithValues(
        [
          {
            value: 'FAKE_VALUE1',
          },
        ],
        { returnSubject: true }
      );

      observableUnderTest = values$;
      controllerSubject = subject;
    });

    When(() => {
      controllerSubject.next('FAKE_VALUE2');
      controllerSubject.complete();
    });

    Then('should emit the value and the delayed error ', async () => {
      expect(observerSpy.getValues()).toEqual(['FAKE_VALUE1', 'FAKE_VALUE2']);
    });
  });
});
