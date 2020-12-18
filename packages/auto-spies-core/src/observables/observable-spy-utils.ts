import {
  EMPTY,
  from,
  merge,
  Observable,
  of,
  ReplaySubject,
  throwError,
  timer,
} from 'rxjs';
import { concatMap, delay, switchMap, take, takeUntil, takeWhile } from 'rxjs/operators';
import {
  FunctionSpyReturnValueContainer,
  CalledWithObject,
  AddObservableSpyMethods,
  ValueConfigPerCall,
} from '..';
import { ValueConfig } from './observable-spy.types';

export function addObservableHelpersToFunctionSpy(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  spyFunction: any,
  valueContainer: FunctionSpyReturnValueContainer
): void {
  const subject: ReplaySubject<any> = new ReplaySubject(1);

  spyFunction.nextWith = function nextWith(value: any) {
    valueContainer.value = subject;
    subject.next(value);
  };

  spyFunction.nextOneTimeWith = function nextOneTimeWith(value: any) {
    valueContainer.value = subject;
    subject.next(value);
    subject.complete();
  };

  spyFunction.nextWithValues = function nextWith<T>(valuesConfigs: ValueConfig<T>[]) {
    /* istanbul ignore else */
    if (valuesConfigs && valuesConfigs.length > 0) {
      const results$ = from(valuesConfigs).pipe(
        // Add delay to "complete" if needed
        concatMap((valueConfig) => {
          if ('complete' in valueConfig && valueConfig.complete && valueConfig.delay) {
            return of(valueConfig).pipe(delay(valueConfig.delay));
          }
          return of(valueConfig);
        }),
        // Complete if needed
        takeWhile((valueConfig) => {
          if (!('complete' in valueConfig)) {
            return true;
          }
          return !valueConfig.complete;
        }),
        // Handle regular values or errors
        concatMap((valueConfig) => {
          if ('value' in valueConfig && valueConfig.value) {
            if (valueConfig.delay) {
              return of(valueConfig.value).pipe(delay(valueConfig.delay));
            }
            return of(valueConfig.value);
          }
          /* istanbul ignore else */
          if ('errorValue' in valueConfig && valueConfig.errorValue) {
            if (valueConfig.delay) {
              return timer(valueConfig.delay).pipe(
                switchMap(() => throwError(valueConfig.errorValue))
              );
            }
            return throwError(valueConfig.errorValue);
          }
          /* istanbul ignore next */
          return EMPTY;
        })
      );
      valueContainer.value = merge(results$, subject.pipe(takeUntil(results$)));
    }
  };

  spyFunction.nextWithPerCall = function nextWithPerCall<T>(
    valueConfigsPerCall: ValueConfigPerCall<T>[]
  ): ReplaySubject<T>[] {
    const returnedSubjects: ReplaySubject<T>[] = [];

    /* istanbul ignore else */
    if (valueConfigsPerCall && valueConfigsPerCall.length > 0) {
      valueContainer.valuesPerCalls = [];

      valueConfigsPerCall.forEach((valueConfiguration) => {
        const replaySubject = new ReplaySubject<T>(1);
        replaySubject.next(valueConfiguration.value);
        returnedSubjects.push(replaySubject);

        let returnedObservable: Observable<T> = replaySubject.asObservable();
        if (valueConfiguration.delay) {
          returnedObservable = returnedObservable.pipe(delay(valueConfiguration.delay));
        }
        if (!valueConfiguration.doNotComplete) {
          returnedObservable = returnedObservable.pipe(take(1));
        }

        /* istanbul ignore else */
        if (valueContainer.valuesPerCalls) {
          valueContainer.valuesPerCalls.push({ wrappedValue: returnedObservable });
        }
      });
    }
    return returnedSubjects;
  };

  spyFunction.throwWith = function throwWith(value: any) {
    valueContainer.value = subject;
    subject.error(value);
  };

  spyFunction.complete = function complete() {
    valueContainer.value = subject;
    subject.complete();
  };

  spyFunction.returnSubject = function complete() {
    valueContainer.value = subject;
    return subject;
  };
}

export function addObservableHelpersToCalledWithObject(
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
): CalledWithObject {
  const subject: ReplaySubject<any> = new ReplaySubject(1);

  calledWithObject.nextWith = function (value: any) {
    subject.next(value);
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.nextOneTimeWith = function (value: any) {
    subject.next(value);
    subject.complete();
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.throwWith = function (value: any) {
    subject.error(value);
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.complete = function () {
    subject.complete();
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
  };

  calledWithObject.returnSubject = function () {
    calledWithObject.argsToValuesMap.set(calledWithArgs, subject);
    return subject;
  };

  return calledWithObject;
}

export function createObservablePropSpy<T>(): T & AddObservableSpyMethods<T> {
  const subject: ReplaySubject<any> = new ReplaySubject();

  const observableSpy: any = subject.asObservable();

  observableSpy.nextWith = function nextWith(value: any) {
    subject.next(value);
  };
  observableSpy.nextOneTimeWith = function nextOneTimeWith(value: any) {
    subject.next(value);
    subject.complete();
  };
  observableSpy.throwWith = function throwWith(value: any) {
    subject.error(value);
  };
  observableSpy.complete = function complete() {
    subject.complete();
  };
  observableSpy.returnSubject = function returnSubject() {
    return subject;
  };

  return observableSpy;
}
