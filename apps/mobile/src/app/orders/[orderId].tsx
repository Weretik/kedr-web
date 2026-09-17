import { OrderDetailScreen } from '@mobile/orders/feature';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';

export default function OrderDetailRoute() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string | string[] }>();
  const raw = Array.isArray(orderId) ? orderId[0] : orderId;
  const parsed = raw && /^\d+$/.test(raw) ? Number(raw) : undefined;
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Замовлення' }} />
      <OrderDetailScreen orderId={parsed} onBack={() => router.back()} />
    </>
  );
}
