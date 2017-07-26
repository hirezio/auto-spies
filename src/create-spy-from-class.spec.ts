import { FakeChildClass, FakeClass } from './fake-classes-to-test';

import { Observable } from 'rxjs/Observable';
import { Spy } from "./spy-types";
import { createSpyFromClass } from './create-spy-from-class';

let fakeClassSpy: Spy<FakeClass>;
let fakeChildClassSpy: Spy<FakeChildClass>;
let fakeValue: any;
let actualResult: any;
let actualRejection: any;

describe('createSpyFromClass', () => {
  Given(() => {
    fakeValue = 'BOOM!';
    actualResult = null;
    actualRejection = null;
  });
  
  describe('FakeClass', () => {

    Given(() => {
      fakeClassSpy = createSpyFromClass(FakeClass);
    });

    describe('fake sync values', () => {
      Given(() => {
        fakeClassSpy.syncMethod.and.returnValue(fakeValue);
      });

      When(() => {
        actualResult = fakeClassSpy.syncMethod()
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('Promises Method', () => {
      When((done) => { 

        fakeClassSpy.promiseMethod() 
          .then(result => {
            actualResult = result;
            done();
          })
          .catch(error => {
            actualRejection = error;
            done()
          })
      }); 

      describe('should be able to fake resolve', () => {
        Given(() => {
          fakeClassSpy.promiseMethod.and.resolveWith(fakeValue);
        });
        Then(() => {
          expect(actualResult).toBe(fakeValue);
        });
      });

      describe('should be able to fake reject', () => {
        Given(() => {
          fakeClassSpy.promiseMethod.and.rejectWith(fakeValue);
        });
        Then(() => {
          expect(actualRejection).toBe(fakeValue);
        });
      });

    });

    describe('Provided promises list', () => {

      Given(() => {
        fakeClassSpy = createSpyFromClass(FakeClass, ['providedPromiseMethod']);
        fakeClassSpy.providedPromiseMethod.and.resolveWith(fakeValue);
      });

      When((done) => {

        fakeClassSpy.providedPromiseMethod()
          .then(result => { 
            actualResult = result;
            done();
          })
          .catch(error => {
            actualRejection = error;
            done()
          })
      });
      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('Observable Method', () => {
      Given(() => {
        fakeClassSpy.observableMethod.and.nextWith(fakeValue);
      });

      When(() => {
        fakeClassSpy.observableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('Provided observables list', () => {

      Given(() => {
        fakeClassSpy = createSpyFromClass(FakeClass, null, ['providedObservableMethod']);
        fakeClassSpy.providedObservableMethod.and.nextWith(fakeValue);
      });
      When(() => {
        fakeClassSpy.providedObservableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });
      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

  });

  describe('Fake Child Class', () => {
    Given(() => {
      fakeChildClassSpy = createSpyFromClass(FakeChildClass);
    });
    describe('Observable method', () => {
      Given(() => {
        fakeChildClassSpy.anotherObservableMethod.and.nextWith(fakeValue);
      });

      When(() => {
        fakeChildClassSpy.anotherObservableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });

    describe('parent methods', () => {
      Given(() => {
        fakeChildClassSpy.observableMethod.and.nextWith(fakeValue);
      });

      When(() => {
        fakeChildClassSpy.observableMethod()
          .subscribe(result => actualResult = result)
          .unsubscribe();
      });

      Then(() => {
        expect(actualResult).toBe(fakeValue);
      });
    });
  });

});