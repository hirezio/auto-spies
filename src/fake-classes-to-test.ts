import 'rxjs/add/observable/of';

import { AsyncSpyable } from "./async-spyable-decorator";
import { Observable } from 'rxjs/Observable';

export class FakeClass {

  someProp: number = 1;

  syncMethod() {
    return '';
  }

  @AsyncSpyable()
  promiseMethod(): Promise<any> { 
    return Promise.resolve();
  }

  providedPromiseMethod(): Promise<any> {
    return Promise.resolve();
  }

  @AsyncSpyable()
  observableMethod(): Observable<any> {
    return Observable.of();
  }

  providedObservableMethod(): Observable<any> {
    return Observable.of();
  }
};



export class FakeChildClass extends FakeClass {
  
  @AsyncSpyable()
  anotherObservableMethod(): Observable<any> {
    return Observable.of();
  }
}