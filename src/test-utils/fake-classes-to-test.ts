import { Observable, of, Subject } from 'rxjs';

export class FakeClass {
  public someProp: number = 1;

  public getSyncValue() {
    return '';
  }

  public getPromise(): Promise<void> {
    return Promise.resolve();
  }

  public getObservable(): Observable<any> {
    return of();
  }

  public getSubject(): Subject<any> {
    return new Subject();
  }
}

// tslint:disable-next-line:max-classes-per-file
export class FakeChildClass extends FakeClass {
  public anotherObservableMethod(): Observable<any> {
    return of();
  }
}
