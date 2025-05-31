const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Provide polyfills for Node.js modules
config.resolver.extraNodeModules = {
  'stream': require.resolve('stream-browserify'),
  'crypto': require.resolve('crypto-browserify'),
  'http': require.resolve('stream-http'),
  'https': require.resolve('https-browserify'),
  'os': require.resolve('os-browserify/browser'),
  'path': require.resolve('path-browserify'),
  'fs': false,
  'net': false,
  'tls': false,
  'child_process': false
};

module.exports = config;
