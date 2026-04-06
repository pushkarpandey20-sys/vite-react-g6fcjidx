import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.devsetu.app',
  appName: 'DevSetu',
  webDir: 'dist',
  server: {
    // Remove this block before submitting to stores —
    // it points to the live Vercel URL so you can test without rebuilding.
    url: 'https://vite-react-g6fcjidx.vercel.app',
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
