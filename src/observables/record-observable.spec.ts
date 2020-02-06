import { Subject } from 'rxjs';
import { recordObservable } from './record-observable';

describe('recordObservable', () => {
  let actualResults: any[];
  let fakeSubject: Subject<number>;

  Given(() => {
    fakeSubject = new Subject();
  });

  When(() => {
    const { recordedResults$, stopRecording } = recordObservable(
      fakeSubject.asObservable()
    );
    recordedResults$.subscribe(recordedResults => (actualResults = recordedResults));
    fakeSubject.next(1);
    fakeSubject.next(2);
    fakeSubject.next(3);
    stopRecording();
  });

  Then(() => {
    expect(actualResults).toEqual([1, 2, 3]);
  });
});
