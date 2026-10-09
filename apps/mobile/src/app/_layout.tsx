import { CartProvider } from '@mobile/cart/feature';
import { AppProviders } from '@mobile/core/shell';
import { Stack } from 'expo-router';

import { appStore } from '../state/app-store';

export default function RootLayout() {
  return (
    <AppProviders store={appStore}>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </AppProviders>
  );
}
