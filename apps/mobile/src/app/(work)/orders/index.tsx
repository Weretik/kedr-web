import { WorkScreen } from '@mobile/core/shell';
import { StateView } from '@mobile/shared/ui';

export default function OrdersRoute() {
  return (
    <WorkScreen title="Замовлення">
      <StateView
        kind="empty"
        message="Розділ з’явиться в наступному оновленні."
        title="Замовлення"
      />
    </WorkScreen>
  );
}
