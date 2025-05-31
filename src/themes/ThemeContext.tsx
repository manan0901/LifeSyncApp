import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

// Type extensions are now in src/types/react-native-paper.d.ts

// Define our custom theme structure that will be used throughout the app
interface ThemeContextType {
  theme: typeof customLightTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeType: (themeType: 'light' | 'dark' | 'system') => void;
}

// Create custom light theme with Material Design 3 structure
const customLightTheme = {
  dark: false,
  version: 3,
  colors: {
    // Standard Material 3 colors
    primary: '#4C84FF',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D4E3FF',
    onPrimaryContainer: '#001C3B',
    secondary: '#FF6B6B',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#FFE1DD',
    onSecondaryContainer: '#2C0E0E',
    tertiary: '#7C5295',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#F4D9FF',
    onTertiaryContainer: '#2E004E',
    error: '#FF5252',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    background: '#FFFFFF',
    onBackground: '#1B1B1F',
    surface: '#F5F5F5',
    onSurface: '#1B1B1F',
    surfaceVariant: '#E3E1EC',
    onSurfaceVariant: '#47464F',
    outline: '#777680',
    outlineVariant: '#C7C5D0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#303034',
    inverseOnSurface: '#F2F0F4',
    inversePrimary: '#A6C8FF',
    surfaceDisabled: 'rgba(28, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(28, 27, 31, 0.38)',
    backdrop: 'rgba(50, 47, 55, 0.4)',
    // Our custom colors
    accent: '#FF6B6B',
    text: '#333333',
    textSecondary: '#757575',
    disabled: '#C1C1C1',
    placeholder: '#9E9E9E',
    cardBackground: '#FFFFFF',
    success: '#4CAF50',
    border: '#E0E0E0',
  },
};

// Create custom dark theme
const customDarkTheme = {
  dark: true,
  version: 3,
  colors: {
    // Standard Material 3 colors
    primary: '#6B9FFF',
    onPrimary: '#001C3B',
    primaryContainer: '#004494',
    onPrimaryContainer: '#D4E3FF',
    secondary: '#FF8787',
    onSecondary: '#2C0E0E',
    secondaryContainer: '#5A2925',
    onSecondaryContainer: '#FFE1DD',
    tertiary: '#D0BCFF',
    onTertiary: '#2E004E',
    tertiaryContainer: '#5A4572',
    onTertiaryContainer: '#F4D9FF',
    error: '#FF6B6B',
    onError: '#410002',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    background: '#121212',
    onBackground: '#E5E1E6',
    surface: '#1E1E1E',
    onSurface: '#E5E1E6',
    surfaceVariant: '#47464F',
    onSurfaceVariant: '#C7C5D0',
    outline: '#91909A',
    outlineVariant: '#47464F',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#E5E1E6',
    inverseOnSurface: '#303034',
    inversePrimary: '#4C84FF',
    surfaceDisabled: 'rgba(229, 225, 230, 0.12)',
    onSurfaceDisabled: 'rgba(229, 225, 230, 0.38)',
    backdrop: 'rgba(50, 47, 55, 0.4)',
    // Our custom colors
    accent: '#FF8787',
    text: '#E1E1E1',
    textSecondary: '#B0B0B0',
    disabled: '#666666',
    placeholder: '#9E9E9E',
    cardBackground: '#1E1E1E',
    success: '#66BB6A',
    border: '#444444',
  },
};

// Create the context with a default value
const ThemeContext = createContext<ThemeContextType>({
  theme: customLightTheme,
  isDarkMode: false,
  toggleTheme: () => {},
  setThemeType: () => {},
});

// Define props for ThemeProvider
interface ThemeProviderProps {
  children: ReactNode;
}

// Create the provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Get the device's color scheme
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<'light' | 'dark' | 'system'>('system');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(colorScheme === 'dark');

  // Effect to update the theme when the color scheme or themeType changes
  useEffect(() => {
    if (themeType === 'system') {
      setIsDarkMode(colorScheme === 'dark');
    } else {
      setIsDarkMode(themeType === 'dark');
    }
  }, [colorScheme, themeType]);

  const theme = isDarkMode ? customDarkTheme : customLightTheme;

  const toggleTheme = () => {
    setThemeType(isDarkMode ? 'light' : 'dark');
  };

  const handleSetThemeType = (type: 'light' | 'dark' | 'system') => {
    setThemeType(type);
  };
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, setThemeType: handleSetThemeType }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Create a custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
