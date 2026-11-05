import { CustomerBar, useConnectivity, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerSummary } from '@mobile/customers/feature';
import { OrdersScreen } from '@mobile/orders/feature';
import { router } from 'expo-router';

export default function OrdersRoute() {
  const customer = useSelectedCustomerSummary();
  const isOnline = useConnectivity()?.isOnline ?? null;

  return (
    <WorkScreen title="Замовлення">
      <CustomerBar customer={customer} onChange={() => router.navigate('/customer')} />
      <OrdersScreen
        isOnline={isOnline}
        onOpenCalculation={() => router.navigate('/calculation')}
        onOpenOrder={(orderId) =>
          router.push({ params: { orderId: orderId.toString() }, pathname: '/orders/[orderId]' })
        }
      />
    </WorkScreen>
  );
}
