import { CartProvider } from '@mobile/cart/feature';
import { AppProviders } from '@mobile/core/shell';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <AppProviders>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </CartProvider>
    </AppProviders>
  );
}
