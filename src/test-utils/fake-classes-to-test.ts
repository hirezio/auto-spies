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
// tslint:disable-next-line:max-classes-per-file
export class FakeGetterSetterClass extends FakeClass {
  // tslint:disable-next-line: variable-name
  private _myProp = 'default value';
  get myProp(): string {
    return this._myProp;
  }
  set myProp(value: string) {
    this._myProp = value;
  }
  get anotherGetter(): number {
    return 1;
  }
  set mySetter(value: number) {}
}
