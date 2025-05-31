import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import Navigation from './src/components/navigation/Navigation';
import { ThemeProvider } from './src/themes/ThemeContext';
import { notificationService } from './src/services/notification.service';

// Request notification permissions when app starts
const AppContent = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      await notificationService.requestPermission();
    };
    
    setupNotifications();
  }, []);
  
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Navigation />
        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
