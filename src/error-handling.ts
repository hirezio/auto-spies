export function throwArgumentsError(expectedArgs: any[], actualArgs: any[]) {
  let errorMessage = `
              The expected arguments were: ${expectedArgs}
              -
              `;
  if (!actualArgs || actualArgs.length === 0) {
    errorMessage += `
              But the function was called without any arguments
              `;
  } else {
    errorMessage += `
              But the actual arguments were: ${actualArgs}
              `;
  }

  throw new Error(errorMessage);
}
