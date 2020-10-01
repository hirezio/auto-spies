import { errorHandler } from './error-handler';

describe('throwArgumentsError', () => {
  let fakeExpectedArgs: any[];
  let fakeActualArgs: any[];
  let actualError: any;

  Given(() => {
    fakeExpectedArgs = [1, 2];
  });

  When(() => {
    try {
      errorHandler.throwArgumentsError(fakeActualArgs);
    } catch (error) {
      actualError = error.message;
    }
  });

  describe('Given actual args are empty and do not match', () => {
    Given(() => {
      fakeActualArgs = [];
    });

    Then('throw the empty error', () => {
      expect(actualError).toContain('But the function was called without any arguments');
    });
  });

  describe('Given actual args do not match', () => {
    Given(() => {
      fakeActualArgs = [1, 2];
    });

    Then('throw error with arguments', () => {
      expect(actualError).toContain('But the actual arguments were: 1,2');
    });
  });

  describe('Given actual args of type object do not match', () => {
    Given(() => {
      fakeActualArgs = [{ yep: 1 }];
    });

    Then('throw error with arguments', () => {
      expect(actualError).toContain('But the actual arguments were: {"yep":1}');
    });
  });
});
