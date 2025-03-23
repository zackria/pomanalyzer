export default {
  testEnvironment: "node", // Use Node.js environment
  transform: {
    "^.+\\.js$": "babel-jest", // Transform ES modules with Babel
  },
  transformIgnorePatterns: [
    "/node_modules/(?!(chalk|ansi-styles|supports-color|strip-ansi|ansi-regex)/)", // Allow specific ES module packages to be transformed
  ],
  testMatch: [
    "**/tests/**/*.test.js",
    "**/?(*.)+(spec|test).js"
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};