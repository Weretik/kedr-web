import { OrderHistoryScreen } from '@mobile/orders/feature';
import { useRouter } from 'expo-router';

export default function OrdersRoute() {
  const router = useRouter();
  return <OrderHistoryScreen onOpenOrder={(order) => router.push(`/orders/${order.orderId}`)} />;
}
