import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../themes/ThemeContext';
import Input from '../core/Input';
import Button from '../core/Button';
import { AuthService } from '../../services/auth.service';
import { storageService } from '../../services/storage.service';
import { setProfile, completeOnboarding } from '../../redux/slices/userSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const authService = new AuthService();

const LoginScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const handleLogin = async () => {
    // Basic validation
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
      try {
      const response = await authService.signIn(email, password);
      
      // Save tokens (in a real app, this would be more secure)
      await storageService.saveData('token', response.token);
      await storageService.saveData('refreshToken', response.refreshToken);
      
      // Update Redux state with user information
      dispatch(setProfile({ 
        name: response.user.username,
        // Other profile data would be fetched from a user service in a real app
      }));
      
      if (response.user.profileComplete) {
        dispatch(completeOnboarding());
        navigation.navigate('Home' as never);
      } else {
        navigation.navigate('Onboarding' as never);
      }
    } catch (error) {
      setErrorMessage((error as Error).message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToSignup = () => {
    navigation.navigate('Signup' as never);
  };
  
  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword' as never);
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
        <View style={styles.logoContainer}>
          <Text style={[styles.appName, { color: theme.colors.primary }]}>LifeSync</Text>
          <Text style={[styles.tagline, { color: theme.colors.onBackground }]}>Your Daily Routine Companion</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.welcomeText, { color: theme.colors.onBackground }]}>Welcome Back</Text>
          <Text style={[styles.instructionText, { color: theme.colors.secondary }]}>
            Please sign in to continue
          </Text>
          
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.error} />
              <Text style={[styles.errorText, { color: theme.colors.error }]}>{errorMessage}</Text>
            </View>
          ) : null}
          
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
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            leftIcon="lock"
            rightIcon={showPassword ? "eye-off" : "eye"}
            onRightIconPress={() => setShowPassword(!showPassword)}
          />
          
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={navigateToForgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          <Button
            title="Sign In"
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.loginButton}
          >
            {isLoading && <ActivityIndicator color="white" style={styles.spinner} />}
          </Button>
          
          <View style={styles.signupContainer}>
            <Text style={{ color: theme.colors.secondary }}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToSignup}>
              <Text style={[styles.signupText, { color: theme.colors.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          
          {/* Optional Social Sign In */}
          <View style={styles.dividerContainer}>
            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            <Text style={[styles.dividerText, { color: theme.colors.outline }]}>or continue with</Text>
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
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: 16,
    marginTop: 8,
  },
  formContainer: {
    width: '100%',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 16,
    marginBottom: 24,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 16,
  },
  spinner: {
    marginRight: 8,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 24,
  },
  signupText: {
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

export default LoginScreen;
