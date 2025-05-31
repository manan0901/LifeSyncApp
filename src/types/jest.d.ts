// Jest type definitions for React Native testing
import '@types/jest';

declare global {
  // Extend the global namespace with Jest types
  var describe: jest.Describe;
  var test: jest.It;
  var it: jest.It;
  var expect: jest.Expect;
  var beforeEach: jest.Lifecycle;
  var beforeAll: jest.Lifecycle;
  var afterEach: jest.Lifecycle;
  var afterAll: jest.Lifecycle;
  var jest: typeof import('@jest/globals').jest;
}

export {};
