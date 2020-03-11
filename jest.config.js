module.exports = {
  transform: {
    '.(js|jsx|ts|tsx)': '@sucrase/jest-plugin'
  },
  testEnvironment: 'node',
  preset: 'ts-jest',
  bail: true,
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/app/**/*.ts'],
  coverageDirectory: './__tests__/coverage',

  coverageReporters: [
    'text',
    'lcov'
  ],
  testMatch: [
    '**/__tests__/**/*.test.ts'
  ]
}
