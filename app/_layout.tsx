import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Frijole': require('@/assets/fonts/Frijole-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={NAV_THEME['light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} translucent={true} />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}

{/* <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
  <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
  <Stack />
  <PortalHost />
</ThemeProvider> 
  DEFAULT WAY
*/}
