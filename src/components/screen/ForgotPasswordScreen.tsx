import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../themes/ThemeContext';
import Input from '../core/Input';
import Button from '../core/Button';
import { AuthService } from '../../services/auth.service';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const authService = new AuthService();

const ForgotPasswordScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleResetPassword = async () => {
    // Basic validation
    if (!email) {
      setErrorMessage('Please enter your email');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const result = await authService.forgotPassword(email);
      
      if (result.success) {
        setSuccessMessage(result.message);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage((error as Error).message || 'An error occurred');
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={navigateToLogin}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.contentContainer}>
          <MaterialCommunityIcons
            name="lock-reset"
            size={80}
            color={theme.colors.primary}
            style={styles.icon}
          />
          
          <Text style={[styles.title, { color: theme.colors.text }]}>Forgot Password</Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Enter your email address and we'll send you instructions to reset your password
          </Text>
          
          {errorMessage ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.error} />
              <Text style={[styles.messageText, { color: theme.colors.error }]}>{errorMessage}</Text>
            </View>
          ) : null}
          
          {successMessage ? (
            <View style={[styles.successContainer, { backgroundColor: '#E8F5E9' }]}>
              <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.success} />
              <Text style={[styles.messageText, { color: theme.colors.success }]}>{successMessage}</Text>
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
          
          <Button
            title="Reset Password"
            onPress={handleResetPassword}
            disabled={isLoading}
            style={styles.resetButton}
          >
            {isLoading && <ActivityIndicator color="white" style={styles.spinner} />}
          </Button>
          
          <TouchableOpacity
            style={styles.loginLink}
            onPress={navigateToLogin}
          >
            <Text style={[styles.loginLinkText, { color: theme.colors.primary }]}>
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    marginTop: 24,
    marginBottom: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  messageText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  resetButton: {
    marginVertical: 24,
    width: '100%',
  },
  spinner: {
    marginRight: 8,
  },
  loginLink: {
    marginTop: 16,
  },
  loginLinkText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ForgotPasswordScreen;
