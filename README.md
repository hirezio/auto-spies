# jasmine-auto-spies

[![npm version](https://img.shields.io/npm/v/jasmine-auto-spies.svg?style=flat-square)](https://www.npmjs.org/package/jasmine-auto-spies)
[![npm downloads](https://img.shields.io/npm/dm/jasmine-auto-spies.svg?style=flat-square)](http://npm-stat.com/charts.html?package=jasmine-auto-spies&from=2017-07-26)
[![Build Status](https://travis-ci.org/hirezio/jasmine-auto-spies.svg?branch=master)](https://travis-ci.org/hirezio/jasmine-auto-spies)
[![codecov](https://img.shields.io/codecov/c/github/hirezio/jasmine-auto-spies.svg)](https://codecov.io/gh/hirezio/jasmine-auto-spies)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)


## IMPORTANT: compatibility

* Version `2.x` and above requires **RxJS 6.0** and above. 
* Version `3.x` and above requires **TypeScript 2.8** and above. 



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

✅ **Keep you tests DRY** - no more repeated spy setup code, no need for separate spy files

✅ **Type completion** for both the original Class and the spy methods

✅ **Automatic return type detection** by using a simple decorator

## Installation

`npm install -D jasmine-auto-spies`


## Usage (JavaScript)

```js

// my-spec.js 

import { createSpyFromClass } from 'jasmine-auto-spies';
import { MyService } from './my-service';
import { MyComponent } from './my-component';

describe('MyComponent', ()=>{

  let myServiceSpy;
  let componentUnderTest;

  beforeEach(()=>{
    myServiceSpy = createSpyFromClass(MyService);
    componentUnderTest = new MyComponent(myServiceSpy);
  });

  it('should get data on init', ()=>{
    const fakeData = [{fake: 'data'}];
    myServiceSpy.getData.and.returnWith(fakeData);

    componentUnderTest.init();

    expect(myServiceSpy.getData).toHaveBeenCalled();
    expect(componentUnderTest.compData).toEqual(fakeData);
  });

});


// my-component.js

export class MyComponent{

  constructor(myService){
    this.myService = myService;
  }
  init(){
    this.compData = this.myService.getData();
  }
}

// my-service.js

export class MyService{

  getData{
    return [
      { ...someRealData... }
    ]
  }
}

```


## Usage (TypeScript)


### TypeScript Setup
Set these 2 properties in your `tsconfig.json` - 

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  }
}
```


### 1. Spying on regular sync methods

```ts

// my-spec.ts

import { Spy, createSpyFromClass } from 'jasmine-auto-spies';
import { MyService } from './my-service';

let myServiceSpy: Spy<MyService>;

beforeEach( ()=> {
  myServiceSpy = createSpyFromClass( MyService );
});

it('should Do something' ()=> {
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

First, annotate the method with `@AsyncSpyable` - 
```ts
import { AsyncSpyable } from 'jasmine-auto-spies';

export class MyService{

   @AsyncSpyable() // <-- MUST ADD THIS
   getItems(): Promise<any> {
      return Promise.resolve( itemsList );
   } 
}
```

Now you can use the `resolveWith` or `rejectWith` methods - 

```ts
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

let myServiceSpy: Spy<MyService>;

beforeEach( ()=> {
  myServiceSpy = createSpyFromClass( MyService )
});

it( ()=>{
  myServiceSpy.getItems.and.resolveWith( fakeItemsList );
  // OR
  myServiceSpy.getItems.and.rejectWith( fakeError );
});

```


### 3. Spy on a `Observable` returning method

First, annotate your Observable returning method with `@AsyncSpyable` - 
```ts
import { AsyncSpyable } from 'jasmine-auto-spies';

export class MyService{

   @AsyncSpyable() // <-- MUST ADD THIS
   getProducts(): Observable<any> {
    return Observable.of( productsList );
   }
}
```

Now you can use the `nextWith` or `throwWith` methods - 

```ts
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

let myServiceSpy: Spy<MyService>;

beforeEach( ()=> {
  myServiceSpy = createSpyFromClass( MyService )
});

it( ()=>{
  myServiceSpy.getProducts.and.nextWith( fakeProductsList);
  // OR
  myServiceSpy.getProducts.and.throwWith( fakeError );
});

```


### Manual Setup

If you need to manually configure async methods by names you could pass them as arrays of strings -

```ts

let spy = createSpyFromClass(
            MyClass, 
            ['promiseMethod1', 'promiseMethod2'],
            ['observableMethod1', 'observableMethod2']
          );

```
