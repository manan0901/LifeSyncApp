import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../themes/ThemeContext';
import Input from '../core/Input';
import Button from '../core/Button';
import { AuthService } from '../../services/auth.service';
import { storageService } from '../../services/storage.service';
import { setProfile } from '../../redux/slices/userSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const authService = new AuthService();

const SignupScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSignup = async () => {
    // Basic validation
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
      try {
      const response = await authService.signUp(email, password, username);
      
      // Save tokens (in a real app, this would be more secure)
      await storageService.saveData('token', response.token);
      await storageService.saveData('refreshToken', response.refreshToken);
      
      // Update Redux state with user information
      dispatch(setProfile({ name: username }));
      
      // Navigate to onboarding
      navigation.navigate('Onboarding' as never);
    } catch (error) {
      setErrorMessage((error as Error).message || 'An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>Create Account</Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.onSurfaceVariant }]}>
            Join LifeSync to organize your daily routine
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>
            </View>
          ) : null}
          
          <Input
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your preferred username"
            autoCapitalize="none"
            leftIcon="account"
          />
          
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="email"
          />
          
          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry={!showPassword}
            leftIcon="lock"
            rightIcon={showPassword ? "eye-off" : "eye"}
            onRightIconPress={() => setShowPassword(!showPassword)}
            helperText="Password must be at least 6 characters long"
          />
          
          <Input
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry={!showPassword}
            leftIcon="lock-check"
          />
          
          <Button
            title="Sign Up"
            onPress={handleSignup}
            disabled={isLoading}
            style={styles.signupButton}
          >
            {isLoading && <ActivityIndicator color="white" style={styles.spinner} />}
          </Button>
          
          <View style={styles.termsContainer}>
            <Text style={[styles.termsText, { color: theme.colors.secondary }]}>
              By signing up, you agree to our{' '}
              <Text style={{ color: theme.colors.primary, fontWeight: '500' }}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={{ color: theme.colors.primary, fontWeight: '500' }}>Privacy Policy</Text>
            </Text>
          </View>
          
          <View style={styles.loginContainer}>
            <Text style={{ color: theme.colors.secondary }}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={[styles.loginText, { color: theme.colors.primary }]}>Sign In</Text>
            </TouchableOpacity>
          </View>
          
          {/* Optional Social Sign Up */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            <Text style={[styles.dividerText, { color: theme.colors.outline }]}>or sign up with</Text>
            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
          </View>
          
          <View style={styles.socialContainer}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}>
              <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}>
              <MaterialCommunityIcons name="apple" size={24} color={theme.colors.onBackground} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.surface }]}>
              <MaterialCommunityIcons name="facebook" size={24} color="#4267B2" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    marginLeft: 8,
  },
  signupButton: {
    marginVertical: 16,
  },
  spinner: {
    marginRight: 8,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  loginText: {
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default SignupScreen;
