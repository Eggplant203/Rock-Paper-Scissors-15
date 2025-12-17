module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    '*.ts',
    '!*.d.ts',
    '!__tests__/**',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
