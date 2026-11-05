import { useConnectivity, WorkScreen } from '@mobile/core/shell';
import { CustomerChoice } from '@mobile/customers/feature';
import { router } from 'expo-router';

export default function CustomerChoiceRoute() {
  const isOnline = useConnectivity()?.isOnline ?? null;

  return (
    <WorkScreen title="Клієнт">
      <CustomerChoice
        isOnline={isOnline}
        onOpenCard={(counterpartyId) =>
          router.push({ params: { counterpartyId }, pathname: '/customer/[counterpartyId]' })
        }
      />
    </WorkScreen>
  );
}
