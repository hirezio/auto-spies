import { Observable, of, Subject } from 'rxjs';

export class FakeClass {
  public someProp: number = 1;

  public getSyncValue(): string {
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

export class FakeChildClass extends FakeClass {
  public anotherObservableMethod(): Observable<any> {
    return of();
  }
}

export abstract class FakeAbstractClass {
  public getSyncValue(): string {
    return '';
  }
}
