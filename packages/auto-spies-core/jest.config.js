module.exports = {
  preset: 'ts-jest',

  verbose: false,
  testEnvironment: 'node',
  resetMocks: true,
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFilesAfterEnv: ['../../node_modules/@hirez_io/jest-given/dist/jest-given.js'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
};
