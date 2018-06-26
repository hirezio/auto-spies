# jasmine-auto-spies

[![npm version](https://img.shields.io/npm/v/jasmine-auto-spies.svg?style=flat-square)](https://www.npmjs.org/package/jasmine-auto-spies)
[![npm downloads](https://img.shields.io/npm/dm/jasmine-auto-spies.svg?style=flat-square)](http://npm-stat.com/charts.html?package=jasmine-auto-spies&from=2017-07-26) [![Greenkeeper badge](https://badges.greenkeeper.io/hirezio/jasmine-auto-spies.svg)](https://greenkeeper.io/)

Create automatic spies from classes in jasmine tests. 
If you're using TypeScript it'll also create auto spies for Promise or Observable returning methods and provide type completion. 

## What is it good for?

- [x] **Keep you tests DRY** - no more repeated spy setup code, no need for separate spy files

- [x] **Type completion** for both the original Class and the spy methods

- [x] **Automatic return type detection** by using a simple decorator

## Installation

`npm install -D jasmine-auto-spies`

## Setup
In your `tsconfig.json` set these 2 flags - 

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
  }
}
```

## Usage

### 1. Spying on regular sync methods

Let's say you have a class -

```ts
class MyService{
  getName(): string{
    return 'Bonnie';
  }
}
```

This is how you create an automatic spy for it - 

```ts
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

let myServiceSpy: Spy<MyService>;

beforeEach( ()=> {
  myServiceSpy = createSpyFromClass( MyService );
});

it( ()=> {
  myServiceSpy.getName.and.returnValue('Fake Name');
  
  ... (the rest of the test) ...
});
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

Now you can use the `nextWith` or `nextWithError` methods - 

```ts
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

let myServiceSpy: Spy<MyService>;

beforeEach( ()=> {
  myServiceSpy = createSpyFromClass( MyService )
});

it( ()=>{
  myServiceSpy.getProducts.and.nextWith( fakeProductsList);
  // OR
  myServiceSpy.getProducts.and.nextWithError( fakeError );
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
