export const errorHandler = {
  throwArgumentsError(actualArgs: any[]): void {
    let errorMessage = `
              The function was configured with 'mustBeCalledWith'
              and expects to be called with specific arguments.
              -
              `;
    if (!actualArgs || actualArgs.length === 0) {
      errorMessage += `
              But the function was called without any arguments
              `;
    } else {
      let formattedArgs = JSON.stringify(actualArgs);
      formattedArgs = formattedArgs.substring(1, formattedArgs.length - 1);

      errorMessage += `
              But the actual arguments were: ${formattedArgs}
              `;
    }

    throw new Error(errorMessage);
  },
};
