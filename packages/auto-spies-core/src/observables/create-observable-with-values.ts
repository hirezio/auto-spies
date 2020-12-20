import { Observable, ReplaySubject } from 'rxjs';
import { ValueConfig } from '..';
import { mergeSubjectWithDefaultValues } from './merge-subject-with-default-values';

export function createObservableWithValues<T>(
  valuesConfigs: ValueConfig<T>[]
): Observable<T>;

export function createObservableWithValues<T>(
  valuesConfigs: ValueConfig<T>[],
  config: { returnSubject: true }
): {
  values$: Observable<T>;
  subject: ReplaySubject<T>;
};

export function createObservableWithValues<T>(
  valuesConfigs: ValueConfig<T>[],
  config?: { returnSubject: boolean }
):
  | Observable<T>
  | {
      values$: Observable<T>;
      subject: ReplaySubject<T>;
    } {
  const subject: ReplaySubject<T> = new ReplaySubject(1);

  const values$ = mergeSubjectWithDefaultValues(subject, valuesConfigs);

  if (config && config.returnSubject) {
    return {
      values$,
      subject,
    };
  }
  return values$;
}
