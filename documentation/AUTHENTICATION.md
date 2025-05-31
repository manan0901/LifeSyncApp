# Authentication and User Management

## Overview
The authentication system in LifeSync provides secure user registration, login, and profile management. It's implemented with JWT tokens for stateless authentication and includes features like forgotten password recovery, social login, and device management.

## Authentication Flow

### 1. Registration Process
- Users register with email, password, and basic profile information
- Email verification is sent to confirm account (mock implementation for now)
- After verification, users are directed to the onboarding flow

### 2. Login Process
- Users login with email/password or social login providers
- JWT token and refresh token are provided upon successful authentication
- Tokens are securely stored using AsyncStorage (wrapped by our StorageService)

### 3. Token Management
- Access tokens expire after 1 hour (configurable)
- Refresh tokens are used to obtain new access tokens
- Token refresh happens automatically in the background
- Refresh tokens expire after 30 days, requiring re-authentication

## Implementation Details

### API Services
The `AuthService` provides these key methods:

```typescript
// Sign in with email/password
signIn(email: string, password: string): Promise<AuthResponse>

// Register new account
signUp(email: string, password: string, username: string): Promise<AuthResponse>

// Sign out (invalidate tokens)
signOut(): Promise<void>

// Request password reset
forgotPassword(email: string): Promise<{ success: boolean; message: string }>

// Complete password reset with token
resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }>

// Refresh authentication token
refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }>

// Check if user is authenticated
isAuthenticated(): boolean
```

### Redux Integration
Authentication state is managed in Redux:
- Current user information
- Authentication status
- Profile completion status

### Security Considerations
- Passwords are never stored in plaintext
- Sensitive operations require recent authentication
- Rate limiting is implemented for auth attempts
- Tokens are rotated on suspicious activity

## Social Authentication
The app supports authentication via:
- Google
- Apple
- Facebook

## Testing Authentication
For testing authentication flows:
1. Mock credentials are available in the AuthService
2. Test accounts: 
   - user@example.com / password123 (profile complete)  
   - test@example.com / test123 (profile incomplete)

## Future Enhancements
- Biometric authentication
- Multi-factor authentication
- Session management across devices
- Advanced security features (suspicious login detection)
