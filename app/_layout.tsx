import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '../global.css';

import { PlayerProvider } from '../context/PlayerContext';
import { PlayerOverlay } from '../components/layout/PlayerOverlay';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: '#ffffff' }}>
      <ThemeProvider value={DefaultTheme}>
        <PlayerProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          <PlayerOverlay />
          <StatusBar style="auto" />
        </PlayerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
