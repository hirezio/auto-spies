import { Observable, Subject, of, defer, from, throwError } from 'rxjs';
import { ObserverSpy } from './observer-spy';

describe('ObserverSpy', () => {
  let fakeObservable: Observable<string>;
  let observerSpy: ObserverSpy<string>;
  let fakeValues: any[];

  Given(() => {
    observerSpy = new ObserverSpy();
  });

  describe(`GIVEN observable emits 3 values and completes
            WHEN subscribing`, () => {
    Given(() => {
      fakeValues = ['first', 'second', 'third'];
      fakeObservable = of(...fakeValues);
    });

    When(() => {
      fakeObservable.subscribe(observerSpy).unsubscribe();
    });

    describe('METHOD: receivedNext', () => {
      Then(() => {
        expect(observerSpy.receivedNext()).toBe(true);
      });
    });

    describe('METHOD: getValues', () => {
      Then(() => {
        expect(observerSpy.getValues()).toEqual(fakeValues);
      });
    });

    describe('METHOD: getValuesLength', () => {
      Then(() => {
        expect(observerSpy.getValuesLength()).toEqual(3);
      });
    });

    describe('METHOD: getFirstValue', () => {
      Then(() => {
        expect(observerSpy.getFirstValue()).toEqual('first');
      });
    });

    describe('METHOD: getValueAt', () => {
      Then(() => {
        expect(observerSpy.getValueAt(1)).toEqual('second');
      });
    });

    describe('METHOD: getLastValue', () => {
      Then(() => {
        expect(observerSpy.getLastValue()).toEqual('third');
      });
    });

    describe('METHOD: receivedComplete', () => {
      Then(() => {
        expect(observerSpy.receivedComplete()).toBe(true);
      });
    });
  });

  describe('GIVEN observable throws WHEN subscribing', () => {
    Given(() => {
      fakeValues = ['first', 'second', 'third'];
      fakeObservable = throwError('FAKE ERROR');
    });

    When(() => {
      fakeObservable.subscribe(observerSpy).unsubscribe();
    });

    describe('METHOD: receivedComplete', () => {
      Then(() => {
        expect(observerSpy.receivedError()).toBe(true);
      });
    });

    describe('METHOD: getError', () => {
      Then(() => {
        expect(observerSpy.getError()).toEqual('FAKE ERROR');
      });
    });
  });
});
