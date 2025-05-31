# Testing Guide for LifeSync App

## Overview
This guide provides instructions for testing the LifeSync app. We use Jest for unit and integration testing, and Detox for end-to-end testing.

## Unit and Integration Testing

### Test Directory Structure
```
__tests__/
  ├── components/       # Component tests
  ├── services/         # Service layer tests
  ├── redux/            # Redux store and slice tests
  └── utils/            # Utility function tests
```

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- Button.test.tsx

# Watch mode for development
npm test -- --watch
```

### Component Testing
We use React Native Testing Library for component tests. When writing component tests:
1. Test both rendering and functionality
2. Mock dependencies appropriately
3. Test all significant props and state changes
4. Verify accessibility features

Example:
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../src/components/core/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button title="Test Button" onPress={() => {}} />);
    expect(getByText('Test Button')).toBeTruthy();
  });
});
```

### Service Testing
For service tests, focus on:
1. Correct API calls and responses
2. Error handling
3. Data transformation
4. Local storage interactions

Example:
```typescript
import { AuthService } from '../src/services/auth.service';

describe('AuthService', () => {
  it('signs in correctly with valid credentials', async () => {
    const authService = new AuthService();
    const response = await authService.signIn('user@example.com', 'password123');
    expect(response).toHaveProperty('token');
  });
});
```

### Redux Testing
When testing Redux:
1. Test individual reducers and actions
2. Verify state transitions
3. Test selectors
4. Test async thunks separately

### Debugging Tests
If tests are failing:
1. Use `console.log` for quick debugging
2. Use `--verbose` flag for detailed output
3. Check for timer/promise-related issues with `jest.useFakeTimers()`
4. Verify mocks are working as expected

## End-to-End Testing
We use Detox for E2E testing of the full application flow.

### Running E2E Tests
```bash
# Build for E2E testing
npm run build:e2e

# Run E2E tests
npm run test:e2e
```

### Writing E2E Tests
Focus on user flows like:
1. Onboarding process
2. Authentication
3. Adding and updating tasks
4. Tracking meals and workouts
5. Navigation between screens

Example:
```javascript
describe('Authentication Flow', () => {
  it('should allow users to log in', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});
```

## Continuous Integration
Our CI pipeline runs:
1. Linting
2. Type checking
3. Unit and integration tests
4. E2E tests (on select devices)

All tests must pass before merging to main branches.
