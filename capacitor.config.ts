import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tryeidolon.app',
  appName: 'Eidolon',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#4f46e5',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#4f46e5'
    }
  }
};

export default config;