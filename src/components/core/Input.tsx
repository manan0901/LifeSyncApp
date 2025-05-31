import React, { forwardRef } from 'react';
import { StyleSheet, TextInput as RNTextInput, TextInputProps, View, Text, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from '../../themes/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: string | React.ReactNode;
  rightIcon?: string | React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputWrapperStyle?: ViewStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
}

const Input = forwardRef<RNTextInput, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  labelStyle,
  inputWrapperStyle,
  inputStyle,
  errorStyle,
  ...rest
}, ref) => {
  const { theme } = useTheme();
  
  // Determine border color based on error state
  const borderColor = error ? theme.colors.error : theme.colors.disabled;
  
  // Render icon based on type (string = MaterialCommunityIcons, ReactNode = as is)
  const renderIcon = (icon: string | React.ReactNode) => {
    if (typeof icon === 'string') {
      return <MaterialCommunityIcons name={icon as any} size={20} color={theme.colors.textSecondary} />;
    }
    return icon;
  };
  
  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label */}
      {label && (
        <Text style={[
          styles.label,
          { color: error ? theme.colors.error : theme.colors.text },
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      
      {/* Input wrapper - contains icon(s) and input */}
      <View style={[
        styles.inputWrapper,
        { 
          borderColor,
          backgroundColor: theme.colors.surface,
        },
        inputWrapperStyle
      ]}>
        {/* Left Icon */}
        {leftIcon && (
          <View style={styles.leftIcon}>
            {renderIcon(leftIcon)}
          </View>
        )}
        
        {/* Text Input */}
        <RNTextInput
          ref={ref}
          style={[
            styles.input,
            { color: theme.colors.text },
            leftIcon ? styles.inputWithLeftIcon : null,
            rightIcon ? styles.inputWithRightIcon : null,
            inputStyle
          ]}
          placeholderTextColor={theme.colors.placeholder}
          {...rest}
        />
        
        {/* Right Icon */}
        {rightIcon && (
          onRightIconPress ? (
            <TouchableOpacity style={styles.rightIcon} onPress={onRightIconPress}>
              {renderIcon(rightIcon)}
            </TouchableOpacity>
          ) : (
            <View style={styles.rightIcon}>
              {renderIcon(rightIcon)}
            </View>
          )
        )}
      </View>
        {/* Error Message */}
      {error && (
        <Text style={[
          styles.error,
          { color: theme.colors.error },
          errorStyle
        ]}>
          {error}
        </Text>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <Text style={[
          styles.helperText,
          { color: theme.colors.textSecondary }
        ]}>
          {helperText}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  leftIcon: {
    paddingLeft: 12,
  },
  rightIcon: {
    paddingRight: 12,  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
