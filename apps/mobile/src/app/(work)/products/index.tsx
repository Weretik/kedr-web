import { WorkScreen } from '@mobile/core/shell';
import { StateView } from '@mobile/shared/ui';

export default function ProductsRoute() {
  return (
    <WorkScreen title="Товари">
      <StateView kind="empty" message="Розділ з’явиться в наступному оновленні." title="Товари" />
    </WorkScreen>
  );
}
