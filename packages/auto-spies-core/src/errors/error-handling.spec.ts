import { errorHandler } from './error-handler';

describe('throwArgumentsError', () => {
  let fakeExpectedArgs: any[];
  let fakeFunctionName: string;
  let fakeActualArgs: any[];
  let actualError: any;

  describe('GIVEN a function name - ', () => {
    Given(() => {
      fakeFunctionName = 'fakeFunction';
      fakeExpectedArgs = [1, 2];
    });

    When(() => {
      try {
        errorHandler.throwArgumentsError(fakeActualArgs, fakeFunctionName);
      } catch (error: any) {
        actualError = error.message;
      }
    });

    describe('GIVEN actual args are empty and do not match', () => {
      Given(() => {
        fakeActualArgs = [];
      });

      Then('throw the empty error', () => {
        expect(actualError).toContain("The function 'fakeFunction' was configured with");
        expect(actualError).toContain(
          'But the function was called without any arguments'
        );
      });
    });

    describe('GIVEN actual args do not match', () => {
      Given(() => {
        fakeActualArgs = [1, 2];
      });

      Then('throw error with arguments', () => {
        expect(actualError).toContain("The function 'fakeFunction' was configured with");
        expect(actualError).toContain('But the actual arguments were: 1,2');
      });
    });

    describe('GIVEN actual args of type object do not match', () => {
      Given(() => {
        fakeActualArgs = [{ yep: 1 }];
      });

      Then('throw error with arguments', () => {
        expect(actualError).toContain("The function 'fakeFunction' was configured with");
        expect(actualError).toContain('But the actual arguments were: {yep:1}');
      });
    });

    describe('GIVEN actual args of type object do not match', () => {
      Given(() => {
        fakeActualArgs = [{ doSomething: function () {} }];
      });

      Then('throw error with arguments', () => {
        expect(actualError).toContain("The function 'fakeFunction' was configured with");
        expect(actualError).toContain(
          'But the actual arguments were: {doSomething:function () { }}'
        );
      });
    });
  });
});
