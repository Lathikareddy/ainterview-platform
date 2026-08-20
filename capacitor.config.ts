import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ainterview.app',
  appName: 'AInterview',
  webDir: 'dist',
  server: {
    // Allow cleartext traffic for dev, production uses HTTPS
    cleartext: false,
    allowNavigation: [
      '*.googleapis.com',
      '*.firebaseapp.com',
      '*.firebasestorage.app',
    ],
  },
  android: {
    backgroundColor: '#0a0a0f',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0a0a0f',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0a0a0f',
    },
  },
};

export default config;
