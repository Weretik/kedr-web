import { WorkScreen } from '@mobile/core/shell';
import { StateView } from '@mobile/shared/ui';

export default function CalculationRoute() {
  return (
    <WorkScreen title="Розрахунок">
      <StateView
        kind="empty"
        message="Розділ з’явиться в наступному оновленні."
        title="Розрахунок"
      />
    </WorkScreen>
  );
}
