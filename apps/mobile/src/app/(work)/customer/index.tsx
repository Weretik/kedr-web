import { WorkScreen } from '@mobile/core/shell';
import { StateView } from '@mobile/shared/ui';

export default function CustomerChoiceRoute() {
  return (
    <WorkScreen title="Клієнт">
      <StateView
        kind="empty"
        message="Пошук і список клієнтів з’являться після синхронізації даних."
        title="Оберіть клієнта"
      />
    </WorkScreen>
  );
}
