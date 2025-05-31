import { AuthResponse, User } from './api.types';
import { storageService } from './storage.service';

// Mock users for development
const mockUsers: { [email: string]: { password: string; user: User } } = {
  'user@example.com': {
    password: 'password123',
    user: {
      id: '1',
      username: 'johndoe',
      email: 'user@example.com',
      profileComplete: true
    }
  },
  'test@example.com': {
    password: 'test123',
    user: {
      id: '2',
      username: 'testuser',
      email: 'test@example.com',
      profileComplete: false
    }
  }
};

export class AuthService {
  // Sign in with email and password
  async signIn(email: string, password: string): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lowerEmail = email.toLowerCase();
    
    // Check if user exists
    if (!mockUsers[lowerEmail]) {
      throw new Error('User not found');
    }
    
    // Check password
    if (mockUsers[lowerEmail].password !== password) {
      throw new Error('Invalid password');
    }
    
    // Return success response
    return {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: mockUsers[lowerEmail].user
    };
  }
  
  // Sign up with email and password
  async signUp(email: string, password: string, username: string): Promise<AuthResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const lowerEmail = email.toLowerCase();
    
    // Check if user already exists
    if (mockUsers[lowerEmail]) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      email: lowerEmail,
      profileComplete: false
    };
    
    // Store new user
    mockUsers[lowerEmail] = {
      password,
      user: newUser
    };
    
    // Return success response
    return {
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      user: newUser
    };
  }
  
  // Sign out
  async signOut(): Promise<void> {
    // In a real app, this would invalidate tokens on the server
    await new Promise(resolve => setTimeout(resolve, 300));
    return;
  }
  
  // Send password reset email
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const lowerEmail = email.toLowerCase();
    
    // Check if user exists
    if (!mockUsers[lowerEmail]) {
      return { success: false, message: 'No account found with this email' };
    }
    
    // In a real app, this would send a password reset email
    return { success: true, message: 'Password reset instructions sent to your email' };
  }
  
  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    // In a real app, this would validate the token and update the password
    return { success: true, message: 'Password has been reset successfully' };
  }
  
  // Refresh authentication token
  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would validate the refresh token and issue new tokens
    if (refreshToken !== 'mock-refresh-token') {
      throw new Error('Invalid refresh token');
    }
    
    return {
      token: 'new-mock-jwt-token',
      refreshToken: 'new-mock-refresh-token'
    };
  }
    // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    // In a real app, this would check if the JWT token is valid and not expired
    const token = await storageService.loadData<string>('token');
    return !!token;
  }
}
