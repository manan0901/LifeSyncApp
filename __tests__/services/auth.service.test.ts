import { AuthService } from '../../src/services/auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('signIn', () => {
    test('should successfully sign in with valid credentials', async () => {
      const mockEmail = 'user@example.com';
      const mockPassword = 'password123';

      const response = await authService.signIn(mockEmail, mockPassword);

      expect(response).toHaveProperty('token');
      expect(response).toHaveProperty('refreshToken');
      expect(response).toHaveProperty('user');
      expect(response.user.email).toBe(mockEmail);
    });

    test('should throw error with invalid email', async () => {
      const mockEmail = 'nonexistent@example.com';
      const mockPassword = 'password123';

      await expect(authService.signIn(mockEmail, mockPassword)).rejects.toThrow('User not found');
    });

    test('should throw error with invalid password', async () => {
      const mockEmail = 'user@example.com';
      const mockPassword = 'wrongpassword';

      await expect(authService.signIn(mockEmail, mockPassword)).rejects.toThrow('Invalid password');
    });
  });

  describe('signUp', () => {
    test('should successfully create a new user', async () => {
      const mockEmail = 'newuser@example.com';
      const mockPassword = 'password123';
      const mockUsername = 'newuser';

      const response = await authService.signUp(mockEmail, mockPassword, mockUsername);

      expect(response).toHaveProperty('token');
      expect(response).toHaveProperty('refreshToken');
      expect(response.user.email).toBe(mockEmail);
      expect(response.user.username).toBe(mockUsername);
      expect(response.user.profileComplete).toBe(false);
    });

    test('should throw error when user already exists', async () => {
      const mockEmail = 'user@example.com'; // Existing user
      const mockPassword = 'password123';
      const mockUsername = 'existinguser';

      await expect(authService.signUp(mockEmail, mockPassword, mockUsername)).rejects.toThrow('User already exists');
    });
  });

  describe('forgotPassword', () => {
    test('should return success for valid email', async () => {
      const mockEmail = 'user@example.com';

      const response = await authService.forgotPassword(mockEmail);

      expect(response.success).toBe(true);
    });

    test('should return failure for invalid email', async () => {
      const mockEmail = 'nonexistent@example.com';

      const response = await authService.forgotPassword(mockEmail);

      expect(response.success).toBe(false);
    });
  });

  describe('refreshToken', () => {
    test('should provide new token with valid refresh token', async () => {
      const mockRefreshToken = 'mock-refresh-token';

      const response = await authService.refreshToken(mockRefreshToken);

      expect(response).toHaveProperty('token');
      expect(response).toHaveProperty('refreshToken');
    });

    test('should throw error with invalid refresh token', async () => {
      const mockRefreshToken = 'invalid-refresh-token';

      await expect(authService.refreshToken(mockRefreshToken)).rejects.toThrow('Invalid refresh token');
    });
  });
});
