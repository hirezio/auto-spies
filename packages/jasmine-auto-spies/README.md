# jasmine-auto-spies

Easy and type safe way to write spies for jasmine tests, for both sync and async (promises, Observables) returning methods.

[![npm version](https://img.shields.io/npm/v/jasmine-auto-spies.svg?style=flat-square)](https://www.npmjs.org/package/jasmine-auto-spies)
[![npm downloads](https://img.shields.io/npm/dm/jasmine-auto-spies.svg?style=flat-square)](http://npm-stat.com/charts.html?package=jasmine-auto-spies&from=2017-07-26)
![Build](https://github.com/hirezio/auto-spies/workflows/Build/badge.svg)
[![codecov](https://img.shields.io/codecov/c/github/hirezio/jasmine-auto-spies.svg)](https://codecov.io/gh/hirezio/jasmine-auto-spies)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](code_of_conduct.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

<div align="center">
  <a href="http://testangular.com/?utm_source=github&utm_medium=link&utm_campaign=jasmine+auto+spies">
    <img src="../../for-readme/test-angular.jpg"
      alt="TestAngular.com - Free Angular Testing Workshop - The Roadmap to Angular Testing Mastery"
      width="600"
    />
  </a>
</div>

## IMPORTANT: compatibility

- Version `2.x` and above requires **RxJS 6.0** and above.
- Version `3.x` and above requires **TypeScript 2.8** and above.

## What is it?

Creating spies has never been EASIER! 💪👏

If you need to create a spy from any class, just do:

```js
const myServiceSpy = createSpyFromClass(MyService);
```

THAT'S IT!

If you're using TypeScript, you get EVEN MORE BENEFITS:

```ts
const myServiceSpy: Spy<MyService> = createSpyFromClass(MyService);
```

Now you can autocomplete AND have an auto spy for each method, returning Observable / Promise specific control methods.

## What is it good for?

✅ **Keep your tests DRY** - no more repeated spy setup code, no need for separate spy files

✅ **Type completion** for both the original Class and the spy methods

✅ **Automatic return type detection** by using a conditional types

## Installation

`yarn add -D jasmine-auto-spies`

or

`npm install -D jasmine-auto-spies`

## Usage (JavaScript)

### `my-component.js`

```js
export class MyComponent {
  constructor(myService) {
    this.myService = myService;
  }
  init() {
    this.compData = this.myService.getData();
  }
}
```

### `my-service.js`

```js
export class MyService{

  getData{
    return [
      { ...someRealData... }
    ]
  }
}
```

### `my-spec.js`

```js
import { createSpyFromClass } from 'jasmine-auto-spies';
import { MyService } from './my-service';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  let myServiceSpy;
  let componentUnderTest;

  beforeEach(() => {
    myServiceSpy = createSpyFromClass(MyService); // <- THIS IS THE IMPORTANT LINE

    componentUnderTest = new MyComponent(myServiceSpy);
  });

  it('should fetch data on init', () => {
    const fakeData = [{ fake: 'data' }];

    myServiceSpy.getData.and.returnWith(fakeData);

    componentUnderTest.init();

    expect(myServiceSpy.getData).toHaveBeenCalled();
    expect(componentUnderTest.compData).toEqual(fakeData);
  });
});
```

## Usage (TypeScript)

### 1. Spying on regular sync methods

```ts
// my-spec.ts

import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { MyService } from './my-service';

let myServiceSpy: Spy<MyService>; // <- THIS IS THE IMPORTANT LINE

beforeEach( ()=> {
  myServiceSpy = createSpyFromClass( MyService );
});

it('should do something' ()=> {
  myServiceSpy.getName.and.returnValue('Fake Name');

  ... (the rest of the test) ...
});


// my-service.ts

class MyService{
  getName(): string{
    return 'Bonnie';
  }
}
```

### 2. Spy on a `Promise` returning method

Use the `resolveWith` or `rejectWith` methods -

```ts
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

let myServiceSpy: Spy<MyService>;

beforeEach(() => {
  myServiceSpy = createSpyFromClass(MyService);
});

it(() => {
  myServiceSpy.getItems.and.resolveWith(fakeItemsList);
  // OR
  myServiceSpy.getItems.and.rejectWith(fakeError);
});
```

### 3. Spy on an `Observable` returning method

Use the `nextWith` or `throwWith` and other methods -

```ts
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

let myServiceSpy: Spy<MyService>;

beforeEach(() => {
  myServiceSpy = createSpyFromClass(MyService);
});

it(() => {
  myServiceSpy.getProducts.and.nextWith(fakeProductsList);
  // OR
  myServiceSpy.getProducts.and.nextOneTimeWith(fakeProductsList); // emits one value and completes
  // OR
  myServiceSpy.getProducts.and.throwWith(fakeError);
  // OR
  myServiceSpy.getProducts.and.complete();
});
```

### 4. Use `calledWith()` to configure conditional return values

You can setup the expected arguments ahead of time
by using `calledWith` like so:

```ts
myServiceSpy.getProducts.calledWith(1).returnValue(true);
```

and it will only return this value if your subject was called with `getProducts(1)`.

#### Oh, and it also works with Promises / Observables:

```ts
myServiceSpy.getProductsPromise.calledWith(1).resolveWith(true);

// OR

myServiceSpy.getProducts$.calledWith(1).nextWith(true);

// OR ANY OTHER ASYNC CONFIGURATION METHOD...
```

### 5. Use `mustBeCalledWith()` to create a mock instead of a stub

```ts
myServiceSpy.getProducts.mustBeCalledWith(1).returnValue(true);
```

is equal to:

```ts
myServiceSpy.getProducts.and.returnValue(true);

expect(myServiceSpy.getProducts).toHaveBeenCalledWith(1);
```

But the difference is that the error is being thrown during `getProducts()` call and not in the `expect(...)` call.

### 6. Creating method spies manually

If you need to manually add methods that you want to be spies by passing an array of names as the second param of the `createSpyFromClass` function:

```ts
let spy = createSpyFromClass(MyClass, ['customMethod1', 'customMethod2']);
```

or as a property on the config object:

```ts
let spy = createSpyFromClass(MyClass, {
  methodsToSpyOn: ['customMethod1', 'customMethod2'],
});
```

And then you could just configure them:

```ts
spy.customMethod1.and.returnValue('bla bla bla...');
```

This is good for times where a method is not part of the `prototype` of the Class but instead being defined in its constructor.

```ts
class MyClass {
  constructor() {
    this.customMethod1 = function () {
      // This definition is not part of MyClass' prototype
    };
  }
}
```

### 7. Create observable properties spies

If you have a property that extends the `Observable` type, you can create a spy for it as follows:

```ts

MyClass{
  myObservable: Observable<any>;
  mySubject: Subject<any>;
}

it('should spy on observable properties', ()=>{

  let classSpy = createSpyFromClass(MyClass, {
      observablePropsToSpyOn: ['myObservable', 'mySubject']
    }
  );

  // and then you could configure it with methods like `nextWith`:

  classSpy.myObservable.nextWith('FAKE VALUE');

  let actualValue;
  classSpy.myObservable.subscribe((value) => actualValue = value )

  expect(actualValue).toBe('FAKE VALUE');

})

```

### 8. Create accessors spies (getters and setters)

If you have a property that extends the `Observable` type, you can create a spy for it.

You need to configure whether you'd like to create a "SetterSpy" or a "GetterSpy" by using the configuration `settersToSpyOn` and `GettersToSpyOn`.

This will create an object on the Spy called `accessorSpies` and through that you'll gain access to either the "setter spies" or the "getter spies":

```ts

MyClass{
  private _myProp: number;
  get myProp(){
    return _myProp;
  }
  set myProp(value: number){
    _myProp = value;
  }
}

  let classSpy: Spy<MyClass>;

  beforeEach(()=>{
    classSpy = createSpyFromClass(MyClass, {
      gettersToSpyOn: ['myProp'],
      settersToSpyOn: ['myProp']
    });
  })

  it('should return the fake value', () => {

      classSpy.accessorSpies.getters.myProp.and.returnValue(10);

      expect(classSpy.myProp).toBe(10);
  });

  it('allow spying on setter', () => {

    classSpy.myProp = 2;

    expect(classSpy.accessorSpies.setters.myProp).toHaveBeenCalledWith(2);
  });

})

```

### 9. Spying on a function

You can create an "auto spy" for a function using:

```ts
import { createFunctionSpy } from 'jasmine-auto-spies';

describe('Testing a function', () => {
  it('should be able to spy on a function', () => {
    function addTwoNumbers(a, b) {
      return a + b;
    }

    const functionSpy = createFunctionSpy<typeof addTwoNumbers>('addTwoNumbers');

    functionSpy.and.returnValue(4);

    expect(functionSpy()).toBe(4);
  });
});
```

This is useful if you have an observable returning function and you want to use `nextWith` for example:

```ts
import { createFunctionSpy } from 'jasmine-auto-spies';
import { Observable, of } from 'rxjs';
import { ObserverSpy } from '@hirez_io/observer-spy';

describe('Testing an observable function', () => {
  it('should be able to spy on observable', () => {
    function getResultsObservable(): Observable<number> {
      return of(1, 2, 3);
    }

    const functionSpy = createFunctionSpy<typeof getResultsObservable>(
      'getResultsObservable'
    );

    functionSpy.and.nextWith(4);
    const observerSpy = new ObserverSpy();
    functionSpy.subscribe(observerSpy);

    expect(observerSpy.getLastValue()).toBe(4);
  });
});
```
