import { AsyncSpyable } from './async-spyable-decorator';
import { Observable, of } from 'rxjs';

export class FakeClass {

  public someProp: number = 1;

  public syncMethod() {
    return '';
  }

  @AsyncSpyable()
  public promiseMethod(): Promise<any> {
    return Promise.resolve();
  }

  public providedPromiseMethod(): Promise<any> {
    return Promise.resolve();
  }

  @AsyncSpyable()
  public observableMethod(): Observable<any> {
    return of();
  }

  public providedObservableMethod(): Observable<any> {
    return of();
  }
};

// tslint:disable-next-line:max-classes-per-file
export class FakeChildClass extends FakeClass {

  @AsyncSpyable()
  public anotherObservableMethod(): Observable<any> {
    return of();
  }
}
