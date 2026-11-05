import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';
import '../global.css';

import { PlayerProvider } from '../context/PlayerContext';
import { PlayerOverlay } from '../components/layout/PlayerOverlay';

// Soft off-white instead of pure white behind every screen
const NAV_THEME = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#F2F0EC', card: '#FAF9F6' },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: '#F2F0EC' }}>
      <ThemeProvider value={NAV_THEME}>
        <PlayerProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen name="schedule" options={{ headerShown: false }} />
              <Stack.Screen name="events" options={{ headerShown: false }} />
              <Stack.Screen name="news/[id]" options={{ headerShown: false }} />
            </Stack>
          <PlayerOverlay />
          <StatusBar style="auto" />
        </PlayerProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
