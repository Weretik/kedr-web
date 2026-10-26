import { StateView } from '@mobile/shared/ui';

export function OrderHistoryEmpty({
  filtered,
  onClear,
}: Readonly<{ filtered: boolean; onClear: () => void }>) {
  return (
    <StateView
      actionLabel={filtered ? 'Очистити фільтр' : undefined}
      icon="receipt-text-outline"
      kind="empty"
      onAction={filtered ? onClear : undefined}
      title={filtered ? 'Для цього клієнта замовлень не знайдено' : 'Замовлень ще немає'}
    />
  );
}
