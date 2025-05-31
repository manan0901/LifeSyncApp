import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { useTheme } from '../../themes/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  style,
  ...rest
}) => {
  const { theme } = useTheme();
  
  // Determine the styles based on the variant and size
  const getVariantStyles = () => {
    const baseStyles = {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      color: '#FFFFFF',
    };
    
    switch (variant) {
      case 'primary':
        return baseStyles;      case 'secondary':
        return {
          backgroundColor: theme.colors.secondary,
          borderColor: theme.colors.secondary,
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.primary,
          color: theme.colors.primary,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          color: theme.colors.primary,
        };
      default:
        return baseStyles;
    }
  };
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          fontSize: 12,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 14,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 32,
          fontSize: 16,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 24,
          fontSize: 14,
        };
    }
  };
  
  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
    // Apply width style if fullWidth is true
  const widthStyle: ViewStyle = fullWidth ? { width: '100%' as const } : {};
  
  // Create a style for the button's text
  const textStyle = {
    color: variantStyles.color,
    fontSize: sizeStyles.fontSize,
    fontWeight: '600' as const,
  };
  
  // Create a unified style object for the button
  const buttonStyles: ViewStyle = {
    backgroundColor: variantStyles.backgroundColor,
    borderColor: variantStyles.borderColor,
    borderWidth: variant === 'outline' ? 1 : 0,
    paddingVertical: sizeStyles.paddingVertical,
    paddingHorizontal: sizeStyles.paddingHorizontal,
    borderRadius: 8,
    opacity: disabled ? 0.5 : 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...widthStyle,
  };
  
  return (
    <TouchableOpacity
      style={[buttonStyles, style]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textStyle.color} />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[styles.text, textStyle]}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    marginHorizontal: 8,
  },
});

export default Button;
