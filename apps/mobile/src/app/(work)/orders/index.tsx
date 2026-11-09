import { CustomerBar, useConnectivity, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerSummary } from '@mobile/customers/feature';
import { OrdersWorkspace } from '@mobile/orders/feature';
import { router } from 'expo-router';

export default function OrdersRoute() {
  const customer = useSelectedCustomerSummary();
  const isOnline = useConnectivity()?.isOnline ?? null;

  return (
    <WorkScreen
      subheader={<CustomerBar customer={customer} onChange={() => router.navigate('/customer')} />}
      title="Замовлення"
    >
      <OrdersWorkspace
        isOnline={isOnline}
        onOpenCalculation={() => router.navigate('/calculation')}
        onOpenOrder={(orderId) =>
          router.push({ params: { orderId: orderId.toString() }, pathname: '/orders/[orderId]' })
        }
      />
    </WorkScreen>
  );
}
