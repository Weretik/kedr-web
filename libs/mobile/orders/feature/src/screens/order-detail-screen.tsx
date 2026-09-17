import { OrderDetailError, OrderDetailLoading, OrderDetailView } from '@mobile/orders/ui';

import { useOrderDetailController } from '../hooks/use-order-detail-controller';

export function OrderDetailScreen({
  orderId,
  onBack,
}: Readonly<{ orderId?: number; onBack: () => void }>) {
  const controller = useOrderDetailController(orderId);
  if (controller.invalid)
    return <OrderDetailError notFound onBack={onBack} onRetry={() => undefined} />;
  if (controller.isLoading) return <OrderDetailLoading />;
  if (controller.notFound)
    return <OrderDetailError notFound onBack={onBack} onRetry={() => undefined} />;
  if (controller.isError || !controller.data)
    return <OrderDetailError onBack={onBack} onRetry={() => void controller.refetch()} />;
  return <OrderDetailView order={controller.data} />;
}
