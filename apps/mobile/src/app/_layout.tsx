import {
  GolosText_400Regular,
  GolosText_500Medium,
  GolosText_600SemiBold,
  GolosText_700Bold,
} from '@expo-google-fonts/golos-text';
import { Unbounded_500Medium, Unbounded_600SemiBold } from '@expo-google-fonts/unbounded';
import { CartProvider } from '@mobile/cart/feature';
import { initializeMobileAuth, isStaff, NoAccessScreen, useMobileSession } from '@mobile/core/auth';
import { AppProviders } from '@mobile/core/shell';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { appStore } from '../state/app-store';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);
void initializeMobileAuth();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    GolosText_400Regular,
    GolosText_500Medium,
    GolosText_600SemiBold,
    GolosText_700Bold,
    Unbounded_500Medium,
    Unbounded_600SemiBold,
  });
  const session = useMobileSession();
  const ready = (fontsLoaded || Boolean(fontError)) && session.status !== 'loading';
  const isSignedIn = session.status === 'authenticated';

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return null;

  if (isSignedIn && !isStaff(session.user)) {
    return (
      <AppProviders store={appStore}>
        <NoAccessScreen />
      </AppProviders>
    );
  }

  // Without a session only the login screen exists; after sign-in it disappears and the tabs open.
  return (
    <AppProviders store={appStore}>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={isSignedIn}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="orders/[orderId]" />
            <Stack.Screen name="product/[productSlug]" />
          </Stack.Protected>
          <Stack.Protected guard={!isSignedIn}>
            <Stack.Screen name="login" />
          </Stack.Protected>
        </Stack>
      </CartProvider>
    </AppProviders>
  );
}
