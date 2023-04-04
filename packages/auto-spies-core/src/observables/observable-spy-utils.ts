import { defer, Observable, ReplaySubject } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import {
  ReturnValueContainer,
  CalledWithObject,
  AddObservableSpyMethods,
  ValueConfigPerCall,
} from '..';
import { mergeSubjectWithDefaultValues } from './merge-subject-with-default-values';
import { ValueConfig } from './observable-spy.types';

export function addObservableHelpersToFunctionSpy(
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  spyFunction: any,
  valueContainer: ReturnValueContainer
): void {
  const subject = createReplaySubject();

  addObservableHelpers(spyFunction, subject, (configuredSubject) => {
    valueContainer.value = configuredSubject;
  });

  addNextWithPerCall(spyFunction, valueContainer);
}

export function addObservableHelpersToCalledWithObject(
  calledWithObject: CalledWithObject,
  calledWithArgs: any[]
): CalledWithObject {
  //
  const subject = createReplaySubject();
  const returnValueContainer: ReturnValueContainer = { value: undefined };

  addObservableHelpers(calledWithObject, subject, (configuredSubject) => {
    returnValueContainer.value = configuredSubject;
    calledWithObject.argsToValuesMap.set(calledWithArgs, returnValueContainer);
  });

  addNextWithPerCall(
    calledWithObject,
    returnValueContainer,
    (configuredReturnValueContainer) => {
      calledWithObject.argsToValuesMap.set(
        calledWithArgs,
        configuredReturnValueContainer
      );
    }
  );

  return calledWithObject;
}

export function createObservablePropSpy<T>(): T & AddObservableSpyMethods<T> {
  let subject = createReplaySubject();

  const observableSpy: any = defer(() => subject);

  addObservableHelpers(observableSpy, subject, (configuredSubject) => {
    subject = configuredSubject;
  });

  return observableSpy;
}

function addObservableHelpers<T>(
  objectToDecorate: any,
  providedSubject: ReplaySubject<T>,
  onSubjectConfiguredCallback: (subject: ReplaySubject<T>) => void
) {
  objectToDecorate.nextWith = function nextWith(value: T) {
    providedSubject.next(value);
    onSubjectConfiguredCallback(providedSubject);
  };
  objectToDecorate.nextOneTimeWith = function nextOneTimeWith(value: any) {
    providedSubject.next(value);
    providedSubject.complete();
    onSubjectConfiguredCallback(providedSubject);
  };

  objectToDecorate.nextWithValues = function nextWithValues<T>(
    valuesConfigs: ValueConfig<T>[]
  ) {
    /* istanbul ignore else */
    if (valuesConfigs && valuesConfigs.length > 0) {
      const results$ = mergeSubjectWithDefaultValues(providedSubject, valuesConfigs);

      onSubjectConfiguredCallback(results$ as ReplaySubject<any>);
    }
  };

  objectToDecorate.throwWith = function throwWith(value: any) {
    providedSubject.error(value);
    onSubjectConfiguredCallback(providedSubject);
  };
  objectToDecorate.complete = function complete() {
    providedSubject.complete();
    onSubjectConfiguredCallback(providedSubject);
  };
  objectToDecorate.returnSubject = function returnSubject() {
    onSubjectConfiguredCallback(providedSubject);
    return providedSubject;
  };
}

function createReplaySubject<T>(): ReplaySubject<T> {
  return new ReplaySubject(1);
}

function addNextWithPerCall(
  objectToDecorate: any,
  returnValueContainer: ReturnValueContainer,
  onValuesPerCallConfigured: (
    configuredReturnValueContainer: ReturnValueContainer
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) => void = function noop() {}
) {
  objectToDecorate.nextWithPerCall = function nextWithPerCall<T>(
    valueConfigsPerCall: ValueConfigPerCall<T>[]
  ): ReplaySubject<T>[] {
    const returnedSubjects: ReplaySubject<T>[] = [];

    /* istanbul ignore else */
    if (valueConfigsPerCall && valueConfigsPerCall.length > 0) {
      returnValueContainer.valuesPerCalls = [];

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
        if (returnValueContainer.valuesPerCalls) {
          returnValueContainer.valuesPerCalls.push({ wrappedValue: returnedObservable });
        }
      });
      onValuesPerCallConfigured(returnValueContainer);
    }
    return returnedSubjects;
  };
}
