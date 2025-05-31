/**
 * This file contains polyfills for Node.js standard library modules
 * that are not available in React Native by default.
 */

// Import the polyfill-global package to set up global polyfills
import 'react-native-polyfill-globals';

// Add any additional specific polyfills here if needed
global.process = global.process || {};
global.process.env = global.process.env || {};

// Ensure Buffer is available
if (typeof global.Buffer === 'undefined') {
  global.Buffer = require('buffer/').Buffer;
}

// Make sure setTimeout and clearTimeout are available
global.setTimeout = global.setTimeout || function(fn, ms) { return setTimeout(fn, ms); };
global.clearTimeout = global.clearTimeout || function(id) { clearTimeout(id); };

// Log to confirm polyfills are loaded
console.log('Polyfills loaded');
