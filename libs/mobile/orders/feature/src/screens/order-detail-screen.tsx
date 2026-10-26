import { OrderDetailError, OrderDetailLoading, OrderDetailView } from '@mobile/orders/ui';
import { ScreenHeader, useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';

import { useOrderDetailController } from '../hooks/use-order-detail-controller';

import type { ReactNode } from 'react';

export function OrderDetailScreen({
  orderId,
  onBack,
}: Readonly<{ orderId?: number; onBack: () => void }>) {
  const controller = useOrderDetailController(orderId);
  return (
    <OrderDetailFrame onBack={onBack} title="Замовлення">
      {renderContent(controller, onBack)}
    </OrderDetailFrame>
  );
}

function renderContent(
  controller: ReturnType<typeof useOrderDetailController>,
  onBack: () => void,
) {
  if (controller.invalid || controller.notFound)
    return <OrderDetailError notFound onBack={onBack} onRetry={() => undefined} />;
  if (controller.isLoading) return <OrderDetailLoading />;
  if (controller.isError || !controller.data)
    return <OrderDetailError onBack={onBack} onRetry={() => void controller.refetch()} />;
  return <OrderDetailView order={controller.data} />;
}

function OrderDetailFrame({
  children,
  onBack,
  title,
}: Readonly<{ children: ReactNode; onBack: () => void; title: string }>) {
  const theme = useKedrTheme();
  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader onBack={onBack} title={title} withInset />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
