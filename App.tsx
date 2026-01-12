import React, { useEffect } from 'react';
import { LogBox } from 'react-native';
import RootStack from './src/navigation/RootStack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
LogBox.ignoreLogs(['Possible Unhandled Promise Rejection']);
import { useThemeStore } from './src/store/useThemeStore';
import { usePlayerStore } from './src/store/usePlayerStore';
export default function App() {
  useEffect(() => {
    useThemeStore.getState().hydrate();
    usePlayerStore.getState().hydrate();
    usePlayerStore.getState().init();
    const { useDownloadStore } = require('./src/store/useDownloadStore');
    useDownloadStore.getState().hydrate();
  }, []);
  return (
    <SafeAreaProvider>
      <RootStack />
    </SafeAreaProvider>
  );
}
