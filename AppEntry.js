// Import polyfills first
import './src/polyfills';

// Import Expo's entry point
import { registerRootComponent } from 'expo';
import App from './App';

// Register the root component
registerRootComponent(App);
