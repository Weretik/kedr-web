import { CalculationPanel } from '@mobile/calculation/feature';
import { CustomerBar, useConnectivity, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerSummary } from '@mobile/customers/feature';
import { router } from 'expo-router';

export default function CalculationRoute() {
  const customer = useSelectedCustomerSummary();
  const isOnline = useConnectivity()?.isOnline ?? null;

  return (
    <WorkScreen title="Розрахунок">
      <CustomerBar customer={customer} onChange={() => router.navigate('/customer')} />
      <CalculationPanel isOnline={isOnline} />
    </WorkScreen>
  );
}
