import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bhaktigo.app',
  appName: 'BhaktiGo',
  webDir: 'dist',
  server: {
    // url: 'https://bhaktigo.com',
    cleartext: true,
  },
  android: {
    backgroundColor: '#1a0f07',
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  ios: {
    backgroundColor: '#1a0f07',
    contentInset: 'automatic',
    limitsNavigationsToAppBoundDomains: false,
    scrollEnabled: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1a0f07',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
