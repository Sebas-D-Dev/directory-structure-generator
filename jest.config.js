// jest.config.js
module.exports = {
  // The root directory that Jest should scan for tests and modules within.
  // This is usually your project's root.
  rootDir: './',

  // An array of glob patterns Jest uses to detect test files.
  // The default patterns are usually sufficient for .test.ts files.
  testMatch: ['<rootDir>/**/__tests__/**/*.ts?(x)', '<rootDir>/**/?(*.)+(spec|test).ts?(x)'],

  // An array of regexp pattern strings that are matched against all test paths
  // before executing the test. If the test path matches any of the patterns,
  // it will be skipped. Useful for ignoring build directories or node_modules.
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/', // If you have a build output directory
  ],

  // A map from regular expressions to paths to transformers.
  // This is crucial for TypeScript. `ts-jest` will compile your TypeScript
  // files before Jest runs them.
  transform: {
    '^.+\.(ts|tsx)$': 'ts-jest',
  },

  // An array of file extensions your modules use.
  // Jest needs to know about .ts and .tsx files.
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // If you're using ts-jest, it's often recommended to use its preset.
  // This will set many of the above options automatically.
  // You can comment out or remove the above `testMatch`, `transform`,
  // and `moduleFileExtensions` if you use the preset, as it provides defaults.
  preset: 'ts-jest',

  // Other common options you might consider:
  // verbose: true, // Display individual test results with the test suite hierarchy.
  // collectCoverage: true, // Collect test coverage information.
  // coverageDirectory: 'coverage', // Directory to output coverage reports.
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Path to a setup file that runs before each test.

  // The test environment that will be used for testing.
  // 'node' is suitable for backend/API route testing.
  testEnvironment: 'node',

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module.
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}
