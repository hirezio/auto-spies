/* eslint-disable @typescript-eslint/no-empty-function */
import { Observable, of, Subject } from 'rxjs';

export class FakeClass {
  public someProp: number = 1;
  public observableProp: Observable<any> = new Observable();

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

  public arrowMethod: () => void = () => {};
}

export class FakeChildClass extends FakeClass {
  public anotherObservableMethod(): Observable<any> {
    return of();
  }
}

export class FakeGetterSetterClass extends FakeClass {
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

  myFunction(): void {}
}

export abstract class FakeAbstractClass {
  public getSyncValue(): string {
    return '';
  }
}
