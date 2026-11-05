import { useConnectivity, WorkScreen } from '@mobile/core/shell';
import { CustomerCard } from '@mobile/customers/feature';
import { IconButton } from '@mobile/shared/ui';
import { router, useLocalSearchParams } from 'expo-router';

export default function CustomerCardRoute() {
  const { counterpartyId } = useLocalSearchParams<{ counterpartyId: string }>();
  const isOnline = useConnectivity()?.isOnline ?? null;

  return (
    <WorkScreen
      headerRight={
        <IconButton
          accessibilityLabel="До списку клієнтів"
          icon="format-list-bulleted"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/customer'))}
          variant="outlined"
        />
      }
      title="Клієнт"
    >
      <CustomerCard counterpartyId={counterpartyId} isOnline={isOnline} key={counterpartyId} />
    </WorkScreen>
  );
}
