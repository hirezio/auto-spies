# jasmine-auto-spies

Easy and type safe way to write spies for jasmine tests, for both sync and async (promises, Observables) returning methods.

[![npm version](https://img.shields.io/npm/v/jasmine-auto-spies.svg?style=flat-square)](https://www.npmjs.org/package/jasmine-auto-spies)
[![npm downloads](https://img.shields.io/npm/dm/jasmine-auto-spies.svg?style=flat-square)](http://npm-stat.com/charts.html?package=jasmine-auto-spies&from=2017-07-26)
[![Build Status](https://travis-ci.org/hirezio/jasmine-auto-spies.svg?branch=master)](https://travis-ci.org/hirezio/jasmine-auto-spies)
[![codecov](https://img.shields.io/codecov/c/github/hirezio/jasmine-auto-spies.svg)](https://codecov.io/gh/hirezio/jasmine-auto-spies)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

<div align="center">
  <a href="http://testangular.com/?utm_source=github&utm_medium=link&utm_campaign=jasmine+auto+spies">
    <img src="for-readme/test-angular.jpg"
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

### Use `calledWith()` to configure conditional return values

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

### Use `mustBeCalledWith()` to create a mock instead of a stub

```ts
myServiceSpy.getProducts.mustBeCalledWith(1).returnValue(true);
```

is equal to:

```ts
myServiceSpy.getProducts.and.returnValue(true);

expect(myServiceSpy.getProducts).toHaveBeenCalledWith(1);
```

But the difference is that the error is being thrown during `getProducts()` call and not in the `expect(...)` call.

### Manual Setup

If you need to manually add methods that you want to be spies by passing an array of names as the second param of the `createSpyFromClass` function:

```ts
let spy = createSpyFromClass(MyClass, ['customMethod1', 'customMethod2']);
```

This is good for times where a method is not part of the `prototype` of the Class but instead being defined in its constructor.

```ts
class MyClass {
  constructor() {
    this.customMethod1 = function() {
      // This definition is not part of MyClass' prototype
    };
  }
}
```
