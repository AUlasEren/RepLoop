import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/store/auth-context';
import { UserProvider } from '@/store/user-context';
import { SettingsProvider } from '@/store/settings-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <AuthProvider>
      <UserProvider>
        <SettingsProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AnimatedSplashOverlay />
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'none',
                gestureEnabled: false,
              }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="workout-detail" />
              <Stack.Screen name="active-workout" options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="edit-profile" />
              <Stack.Screen name="workout-prefs" />
              <Stack.Screen name="notifications" />
              <Stack.Screen name="privacy" />
              <Stack.Screen name="help" />
            </Stack>
          </ThemeProvider>
        </SettingsProvider>
      </UserProvider>
    </AuthProvider>
  );
}
