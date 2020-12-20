import {
  ReplaySubject,
  Observable,
  from,
  of,
  timer,
  throwError,
  EMPTY,
  merge,
} from 'rxjs';
import { concatMap, delay, takeWhile, switchMap, takeUntil } from 'rxjs/operators';
import { ValueConfig } from '..';

export function mergeSubjectWithDefaultValues<T>(
  subject: ReplaySubject<T>,
  valuesConfigs: ValueConfig<T>[]
): Observable<T> {
  const onCompleteSubject = new ReplaySubject<void>(1);
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
      if (valueConfig.complete) {
        onCompleteSubject.next();
        return false;
      }
      return true;
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
  return merge(results$, subject.pipe(takeUntil(onCompleteSubject)));
}
