# jasmine-auto-spies
Create automatic spies from classes in jasmine tests, including method returning Promises and Observables

## Motivation

Setting up ways to control async objects like promises, or potential async objects like Observables is hard.

What if there was a short and simple API for setting up automatic async spies in Jasmine?

## Requirements

In your `tsconfig.json` file make sure that you have the following property set to true - 
`emitDecoratorMetadata: true`

And add `@AsyncSpyable()` before every method which returns a Promise or an Observable

## Installation

`npm install -D jasmine-auto-spies`

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

it(){
  myServiceSpy.getName.and.returnValue('Fake Name');
  
  ... (the rest of the test) ...
}
```

### 2. Create a spy for a promise

First, annotate your promise returning method with `@AsyncSpyable` - 
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

it(){
  myServiceSpy.getItems.and.resolveWith( fakeItemsList );
  // OR
  myServiceSpy.getItems.and.rejectWith( fakeError );
}

```


### 3. Create a spy for an Observable

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

Now you can use the `nextWith` method - 

```ts
import { Spy, createSpyFromClass } from 'jasmine-auto-spies';

let myServiceSpy: Spy<MyService>;

beforeEach( ()=> {
  myServiceSpy = createSpyFromClass( MyService )
});

it(){
  myServiceSpy.getProducts.and.nextWith( fakeProductsList);
}

```