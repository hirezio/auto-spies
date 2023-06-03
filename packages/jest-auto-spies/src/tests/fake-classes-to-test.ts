/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { Observable, of, Subject } from 'rxjs';

export class FakeClass {
  public someProp: number = 1;
  public observableProp: Observable<any> = new Observable();
  public subjectProp: Subject<any> = new Subject();

  public get observablePropAsGetter() {
    return this.observableProp;
  }

  public getSyncValue(..._args: any[]): string {
    return '';
  }

  public getNullableSyncValue(..._args: any[]): string | null {
    return '';
  }

  public getPromise(..._args: any[]): Promise<any> {
    return Promise.resolve();
  }

  public getObservable(..._args: any[]): Observable<any> {
    return of();
  }

  public getSubject(): Subject<any> {
    return new Subject();
  }

  public arrowMethod: () => string = () => '';
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

  abstract needToImplementThis(): string;
}
