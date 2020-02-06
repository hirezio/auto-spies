import { Observable, Subject } from 'rxjs';

import { takeUntil, toArray } from 'rxjs/operators';

interface RecordObservableReturnType<T> {
  recordedResults$: Observable<T[]>;
  stopRecording: () => void;
}

export function recordObservable<T>(
  source: Observable<T>
): RecordObservableReturnType<T> {
  const completeSubject = new Subject();
  function stopRecording() {
    completeSubject.next();
  }

  const recordedResults$ = source.pipe(
    takeUntil(completeSubject),
    toArray()
  );

  return {
    stopRecording,
    recordedResults$
  };
}
