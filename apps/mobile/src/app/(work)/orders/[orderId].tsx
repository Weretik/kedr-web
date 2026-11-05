import { useConnectivity, WorkScreen } from '@mobile/core/shell';
import { OrderDetailScreen } from '@mobile/orders/feature';
import { IconButton } from '@mobile/shared/ui';
import { router, useLocalSearchParams } from 'expo-router';

export default function OrderRoute() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const isOnline = useConnectivity()?.isOnline ?? null;

  return (
    <WorkScreen
      headerRight={
        <IconButton
          accessibilityLabel="До замовлень"
          icon="format-list-bulleted"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/orders'))}
          variant="outlined"
        />
      }
      title="Замовлення"
    >
      <OrderDetailScreen isOnline={isOnline} key={orderId} orderId={Number(orderId)} />
    </WorkScreen>
  );
}
