import { AppProviders } from '@mobile/core/shell';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AppProviders>
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}
