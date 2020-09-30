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
  coveragePathIgnorePatterns: ['/node_modules/', 'src/tests'],
  setupFilesAfterEnv: [
    '../../node_modules/@hirez_io/jest-given/dist/jest-given.js',
    '../../node_modules/@hirez_io/observer-spy/dist/setup-auto-unsubscribe.js',
  ],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
};
