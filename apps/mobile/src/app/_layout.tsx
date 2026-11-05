import {
  GolosText_400Regular,
  GolosText_500Medium,
  GolosText_600SemiBold,
  GolosText_700Bold,
} from '@expo-google-fonts/golos-text';
import {
  initializeMobileAuth,
  isStaff,
  NoAccessScreen,
  UnlockScreen,
  useMobileSession,
} from '@mobile/core/auth';
import { AppProviders } from '@mobile/core/shell';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

void SplashScreen.preventAutoHideAsync().catch(() => undefined);
void initializeMobileAuth();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    GolosText_400Regular,
    GolosText_500Medium,
    GolosText_600SemiBold,
    GolosText_700Bold,
  });
  const session = useMobileSession();
  const ready = (fontsLoaded || Boolean(fontError)) && session.status !== 'loading';
  const isSignedIn = session.status === 'authenticated';

  useEffect(() => {
    if (ready) void SplashScreen.hideAsync().catch(() => undefined);
  }, [ready]);

  if (!ready) return null;

  if (session.status === 'locked') {
    return (
      <AppProviders>
        <UnlockScreen user={session.user} />
      </AppProviders>
    );
  }

  if (session.status === 'authenticated' && !isStaff(session.user)) {
    return (
      <AppProviders>
        <NoAccessScreen />
      </AppProviders>
    );
  }

  // Without a session only the login screen exists; after sign-in the working area opens.
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isSignedIn}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(work)" />
        </Stack.Protected>
        <Stack.Protected guard={!isSignedIn}>
          <Stack.Screen name="login" />
        </Stack.Protected>
      </Stack>
    </AppProviders>
  );
}
