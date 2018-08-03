import { AsyncSpyable } from './async-spyable-decorator';
import { Observable, of } from 'rxjs';

export class FakeClass {

  public someProp: number = 1;

  public syncMethod() {
    return '';
  }

  @AsyncSpyable()
  public promiseMethod(): Promise<void> {
    return Promise.resolve();
  }

  public providedPromiseMethod(): Promise<void> {
    return Promise.resolve();
  }

  @AsyncSpyable()
  public observableMethod(): Observable<void> {
    return of();
  }

  public providedObservableMethod(): Observable<void> {
    return of();
  }
}

// tslint:disable-next-line:max-classes-per-file
export class FakeChildClass extends FakeClass {

  @AsyncSpyable()
  public anotherObservableMethod(): Observable<any> {
    return of();
  }
}
