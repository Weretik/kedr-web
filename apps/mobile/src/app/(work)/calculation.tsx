import { CustomerBar, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerSummary } from '@mobile/customers/feature';
import { StateView } from '@mobile/shared/ui';
import { router } from 'expo-router';

export default function CalculationRoute() {
  const customer = useSelectedCustomerSummary();

  return (
    <WorkScreen title="Розрахунок">
      <CustomerBar customer={customer} onChange={() => router.navigate('/customer')} />
      <StateView
        kind="empty"
        message="Розділ з’явиться в наступному оновленні."
        title="Розрахунок"
      />
    </WorkScreen>
  );
}
