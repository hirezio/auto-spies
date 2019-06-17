import { Observable, of, Subject } from 'rxjs';

export class FakeClass {
  public someProp: number = 1;

  public syncMethod() {
    return '';
  }

  public promiseMethod(): Promise<void> {
    return Promise.resolve();
  }

  public providedPromiseMethod(): Promise<void> {
    return Promise.resolve();
  }

  public observableMethod(): Observable<any> {
    return of();
  }

  public subjectMethod(): Subject<any> {
    return new Subject();
  }

  public providedObservableMethod(): Observable<void> {
    return of();
  }
}

// tslint:disable-next-line:max-classes-per-file
export class FakeChildClass extends FakeClass {
  public anotherObservableMethod(): Observable<any> {
    return of();
  }
}
