# jasmine-auto-spies

Easy and type safe way to write spies for jasmine tests, for both sync and async (promises, Observables) returning methods.

[![npm version](https://img.shields.io/npm/v/jasmine-auto-spies.svg?style=flat-square)](https://www.npmjs.org/package/jasmine-auto-spies)
[![npm downloads](https://img.shields.io/npm/dm/jasmine-auto-spies.svg?style=flat-square)](http://npm-stat.com/charts.html?package=jasmine-auto-spies&from=2017-07-26)
![Build](https://github.com/hirezio/auto-spies/workflows/Build/badge.svg)
[![codecov](https://img.shields.io/codecov/c/github/hirezio/auto-spies.svg?flags=jasmine-auto-spies)](https://codecov.io/gh/hirezio/auto-spies)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square)](../../CODE_OF_CONDUCT.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-7-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

<br/>

<div align="center">
  <a href="http://testangular.com/?utm_source=github&utm_medium=link&utm_campaign=jasmine+auto+spies">
    <img src="../../for-readme/test-angular.jpg"
      alt="TestAngular.com - Free Angular Testing Workshop - The Roadmap to Angular Testing Mastery"
      width="600"
    />
  </a>
</div>

<br/>

## IMPORTANT: compatibility

- Version `2.x` and above requires **RxJS 6.0** and above.
- Version `3.x` and above requires **TypeScript 2.8** and above.

<br/>

# Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)

- [THE PROBLEM: writing manual spies is tedious](#the-problem-writing-manual-spies-is-tedious)
- [THE SOLUTION: Auto Spies! 💪](#the-solution-auto-spies-)

- [Usage (JavaScript)](#usage-javascript)

- [Usage (TypeScript)](#usage-typescript)

  - [▶ Angular developers - use `TestBed.inject<any>(...)`](#-angular-developers---use-testbedinjectany)
  - [▶ Spying on synchronous methods](#-spying-on-synchronous-methods)
  - [▶ Spying on methods (manually)](#-spying-on-methods-manually)
  - [▶ Spying on Promises](#-spying-on-promises)
  - [▶ Spying on Observables](#-spying-on-observables)
  - [▶ Spying on observable properties](#-spying-on-observable-properties)
  - [▶ `calledWith()` - conditional return values](#-calledwith---conditional-return-values)

  - [▶ `mustBeCalledWith()` - conditional return values that throw errors (Mocks)](#-mustbecalledwith---conditional-return-values-that-throw-errors-mocks)
  - [▶ Create accessors spies (getters and setters)](#-create-accessors-spies-getters-and-setters)
  - [▶ Spying on a function](#-spying-on-a-function)
  - [▶ Spying on abstract classes](#-spying-on-abstract-classes)

- [Contributing](#contributing)
- [Code Of Conduct](#code-of-conduct)
- [Contributors ✨](#contributors-)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<br/>

## Installation

```console
yarn add -D jasmine-auto-spies
```

or

```console
npm install -D jasmine-auto-spies
```

<br/>

## THE PROBLEM: writing manual spies is tedious

You've probably seen this type of manual spies in tests:

```js
let mySpy = {
  myMethod: jasmine.createSpy('myMethod'),
};
```

or even:

```js
let mySpy = jasmine.createSpyObj('mySpy', ['myMethod']);
```

The problem with that is first -

- ⛔ You need to repeat the method names in each test.
- ⛔ Strings are not "type safe" or "refactor friendly"
- ⛔ You only have **synchronous** configuration helpers (like `returnValue`)
- ⛔ You don't have the ability to write conditional return values

<br>

# THE SOLUTION: Auto Spies! 💪

If you need to create a spy from any class, just do:

```js
const myServiceSpy = createSpyFromClass(MyService);
```

THAT'S IT!

If you're using TypeScript, you get EVEN MORE BENEFITS:

```ts
const myServiceSpy: Spy<MyService> = createSpyFromClass(MyService);
```

Now that you have an auto spy you'll be able to:

- ✅ Have a spy with all of its methods generated **automatically** as "spy methods".

- ✅ Rename/refactor your methods and have them **change in ALL tests at once**

- ✅ Asynchronous helpers for **Promises** and **Observables**.

- ✅ Conditional return values with `calledWith` and `mustBeCalledWith`

- ✅ Have **Type completion** for both the original Class and the spy methods

- ✅ Spy on **getters** and **setters**

- ✅ Spy on **Observable properties**

<br/>

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
    //                      👇
    myServiceSpy = createSpyFromClass(MyService); // <- THIS IS THE IMPORTANT LINE

    componentUnderTest = new MyComponent(myServiceSpy);
  });

  it('should fetch data on init', () => {
    const fakeData = [{ fake: 'data' }];

    myServiceSpy.getData.and.returnValue(fakeData);

    componentUnderTest.init();

    expect(myServiceSpy.getData).toHaveBeenCalled();
    expect(componentUnderTest.compData).toEqual(fakeData);
  });
});
```

<br/>

## Usage (TypeScript)

### ▶ Angular developers - use `TestBed.inject<any>(...)`

⚠ Make sure you cast your spy with `any` when you inject it:

```ts
import { MyService } from './my-service';
import { Spy, createSpyFromClass } from 'jest-auto-spies';

let serviceUnderTest: MyService;

//                 👇
let apiServiceSpy: Spy<ApiService>;

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      MyService,
      //                                       👇
      { provide: ApiService, useValue: createSpyFromClass(ApiService) },
    ],
  });

  serviceUnderTest = TestBed.inject(MyService);

  //                             👇
  apiServiceSpy = TestBed.inject<any>(ApiService);
});
```

<br/>

### ▶ Spying on synchronous methods

```ts
// my-service.ts

class MyService{
  getName(): string{
    return 'Bonnie';
  }
}

// my-spec.ts

import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { MyService } from './my-service';

//                👇
let myServiceSpy: Spy<MyService>; // <- THIS IS THE IMPORTANT LINE

beforeEach( ()=> {
  //                     👇
  myServiceSpy = createSpyFromClass( MyService );
});

it('should do something', ()=> {
  myServiceSpy.getName.and.returnValue('Fake Name');

  ... (the rest of the test) ...
});

```

<br/>

### ▶ Spying on methods (manually)

For cases that you have methods which are not part of the Class prototype (but instead being defined in the constructor), for example:

```ts
class MyClass {
  constructor() {
    this.customMethod1 = function () {
      // This definition is not part of MyClass' prototype
    };
  }
}
```

You can **FORCE** the creation of this methods spies like this:

```
//                                   👇
let spy = createSpyFromClass(MyClass, ['customMethod1', 'customMethod2']);
```

**OR THIS WAY** -

```ts
let spy = createSpyFromClass(MyClass, {
  //     👇
  methodsToSpyOn: ['customMethod1', 'customMethod2'],
});
```

<br/>

### ▶ Spying on Promises

Use the `resolveWith` or `rejectWith` methods.

⚠ You **must define a return type** `: Promise<SomeType>` for it to work!

```ts
// SERVICE:

class MyService {
  // (you must define a return type)
  //             👇
  getItems(): Promise<Item[]> {
    return http.get('/items');
  }
}

// TEST:

import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

let myServiceSpy: Spy<MyService>;

beforeEach(() => {
  myServiceSpy = createSpyFromClass(MyService);
});

it(() => {
  //                            👇
  myServiceSpy.getItems.and.resolveWith(fakeItemsList);

  // OR
  //                            👇
  myServiceSpy.getItems.and.rejectWith(fakeError);
});
```

<br/>

### ▶ Spying on Observables

Use the `nextWith` or `throwWith` and other helper methods.

⚠ You **must define a return type** `: Observable<SomeType>` for it to work!

```ts
// SERVICE:

class MyService {
  // (you must define a return type)
  //             👇
  getItems(): Observable<Item[]> {
    return http.get('/items');
  }
}

// TEST:

import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

let myServiceSpy: Spy<MyService>;

beforeEach(() => {
  myServiceSpy = createSpyFromClass(MyService);
});

it(() => {
  //                           👇
  myServiceSpy.getItems.and.nextWith(fakeItemsList);

  // OR
  //                              👇
  myServiceSpy.getItems.and.nextOneTimeWith(fakeItemsList); // emits one value and completes

  // OR
  //                            👇
  myServiceSpy.getItems.and.throwWith(fakeError);

  // OR
  //                            👇
  myServiceSpy.getItems.and.complete();

  // OR

  // "returnSubject" is good for cases where you want
  // to separate the Spy Observable creation from it's usage.

  //                                             👇
  const subject = myServiceSpy.getItems.and.returnSubject(); // create and get a ReplaySubject
  subject.next(fakeItemsList);
});
```

<br/>

### ▶ Spying on observable properties

If you have a property that extends the `Observable` type, you can create a spy for it as follows:

```ts

MyClass{
  myObservable: Observable<any>;
  mySubject: Subject<any>;
}

it('should spy on observable properties', ()=>{

  let classSpy = createSpyFromClass(MyClass, {
      //         👇
      observablePropsToSpyOn: ['myObservable', 'mySubject']
    }
  );

  // and then you could configure it with methods like `nextWith`:
  //                      👇
  classSpy.myObservable.nextWith('FAKE VALUE');

  let actualValue;
  classSpy.myObservable.subscribe((value) => actualValue = value )

  expect(actualValue).toBe('FAKE VALUE');

})

```

<br/>

### ▶ `calledWith()` - conditional return values

You can setup the expected arguments ahead of time
by using `calledWith` like so:

```ts
//                           👇
myServiceSpy.getProducts.calledWith(1).returnValue(true);
```

and it will only return this value if your subject was called with `getProducts(1)`.

#### Oh, and it also works with Promises / Observables:

```ts
//                                  👇             👇
myServiceSpy.getProductsPromise.calledWith(1).resolveWith(true);

// OR

myServiceSpy.getProducts$.calledWith(1).nextWith(true);

// OR ANY OTHER ASYNC CONFIGURATION METHOD...
```

<br/>

### ▶ `mustBeCalledWith()` - conditional return values that throw errors (Mocks)

```ts
//                              👇
myServiceSpy.getProducts.mustBeCalledWith(1).returnValue(true);
```

is the same as:

```ts
myServiceSpy.getProducts.and.returnValue(true);

expect(myServiceSpy.getProducts).toHaveBeenCalledWith(1);
```

But the difference is that the error is being thrown during `getProducts()` call and not in the `expect(...)` call.

<br/>

### ▶ Create accessors spies (getters and setters)

If you have a property that extends the `Observable` type, you can create a spy for it.

You need to configure whether you'd like to create a "SetterSpy" or a "GetterSpy" by using the configuration `settersToSpyOn` and `GettersToSpyOn`.

This will create an object on the Spy called `accessorSpies` and through that you'll gain access to either the "setter spies" or the "getter spies":

```ts

// CLASS:

MyClass{
  private _myProp: number;
  get myProp(){
    return _myProp;
  }
  set myProp(value: number){
    _myProp = value;
  }
}

// TEST:

let classSpy: Spy<MyClass>;

beforeEach(()=>{
  classSpy = createSpyFromClass(MyClass, {

    //      👇
    gettersToSpyOn: ['myProp'],

    //      👇
    settersToSpyOn: ['myProp']
  });
})

it('should return the fake value', () => {

    //            👇          👇     👇
    classSpy.accessorSpies.getters.myProp.and.returnValue(10);

    expect(classSpy.myProp).toBe(10);
});

it('allow spying on setter', () => {

  classSpy.myProp = 2;

  //                  👇          👇     👇
  expect(classSpy.accessorSpies.setters.myProp).toHaveBeenCalledWith(2);
});

```

<br/>

### ▶ Spying on a function

You can create an "auto spy" for a function using:

```ts
import { createFunctionSpy } from 'jasmine-auto-spies';

describe('Testing a function', () => {
  it('should be able to spy on a function', () => {
    function addTwoNumbers(a, b) {
      return a + b;
    }
    //                         👇           👇
    const functionSpy = createFunctionSpy<typeof addTwoNumbers>('addTwoNumbers');

    functionSpy.and.returnValue(4);

    expect(functionSpy()).toBe(4);
  });
});
```

Could also be useful for Observables -

```ts
// FUNCTION:

function getResultsObservable(): Observable<number> {
  return of(1, 2, 3);
}

// TEST:

it('should ...', () => {
  const functionSpy = createFunctionSpy<typeof getResultsObservable>(
    'getResultsObservable'
  );

  functionSpy.nextWith(4);

  // ... rest of the test
});
```

<br/>

### ▶ Spying on abstract classes

Here's a nice trick you could apply in order to spy on abstract classes -

```ts
//  👇
abstract class MyAbstractClass {
  getName(): string {
    return 'Bonnie';
  }
}

describe(() => {
  //                                                    👇
  abstractClassSpy = createSpyFromClass(MyAbstractClass as any);
  abstractClassSpy.getName.and.returnValue('Evil Baboon');
});
```

And if you have **abstract methods** on that abstract class -

```ts
abstract class MyAbstractClass {
  // 👇
  abstract getAnimalName(): string;
}

describe(() => {
  //                                                                     👇
  abstractClassSpy = createSpyFromClass(MyAbstractClass as any, ['getAnimalName']);
  // OR

  abstractClassSpy.getAnimalName.and.returnValue('Evil Badger');
});
```

<br/>

---

<br/>

## Contributing

Want to contribute? Yayy! 🎉

Please read and follow our [Contributing Guidelines](../../CONTRIBUTING.md) to learn what are the right steps to take before contributing your time, effort and code.

Thanks 🙏

<br/>

## Code Of Conduct

Be kind to each other and please read our [code of conduct](../../CODE_OF_CONDUCT.md).

<br/>

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://www.hirez.io/"><img src="https://avatars1.githubusercontent.com/u/1430726?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Shai Reznik</b></sub></a><br /><a href="https://github.com/hirezio/auto-spies/commits?author=shairez" title="Code">💻</a> <a href="https://github.com/hirezio/auto-spies/commits?author=shairez" title="Documentation">📖</a> <a href="#ideas-shairez" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-shairez" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#maintenance-shairez" title="Maintenance">🚧</a> <a href="#mentoring-shairez" title="Mentoring">🧑‍🏫</a> <a href="https://github.com/hirezio/auto-spies/pulls?q=is%3Apr+reviewed-by%3Ashairez" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/hirezio/auto-spies/commits?author=shairez" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Bnaya"><img src="https://avatars0.githubusercontent.com/u/1304862?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Bnaya Peretz</b></sub></a><br /><a href="https://github.com/hirezio/auto-spies/commits?author=Bnaya" title="Code">💻</a> <a href="#ideas-Bnaya" title="Ideas, Planning, & Feedback">🤔</a> <a href="#tool-Bnaya" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/shuebner"><img src="https://avatars0.githubusercontent.com/u/1770684?v=4?s=100" width="100px;" alt=""/><br /><sub><b>shuebner</b></sub></a><br /><a href="https://github.com/hirezio/auto-spies/commits?author=shuebner" title="Code">💻</a> <a href="#ideas-shuebner" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/hirezio/auto-spies/commits?author=shuebner" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://dev-front.herokuapp.com/"><img src="https://avatars0.githubusercontent.com/u/5671930?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Meksi</b></sub></a><br /><a href="https://github.com/hirezio/auto-spies/commits?author=meksof" title="Code">💻</a> <a href="https://github.com/hirezio/auto-spies/commits?author=meksof" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/taylor-ben"><img src="https://avatars0.githubusercontent.com/u/37868849?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Taylor Ben</b></sub></a><br /><a href="#ideas-taylor-ben" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://yonatankra.com/"><img src="https://avatars0.githubusercontent.com/u/6459899?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Yonatan Kra</b></sub></a><br /><a href="https://github.com/hirezio/auto-spies/commits?author=YonatanKra" title="Code">💻</a></td>
    <td align="center"><a href="http://www.treestructure.net/"><img src="https://avatars3.githubusercontent.com/u/780083?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Martin Baum</b></sub></a><br /><a href="https://github.com/hirezio/auto-spies/commits?author=treestructure" title="Code">💻</a> <a href="https://github.com/hirezio/auto-spies/commits?author=treestructure" title="Tests">⚠️</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

<br/>

## License

MIT
