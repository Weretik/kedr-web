import { StateView } from '@mobile/shared/ui';

export function OrderDetailLoading() {
  return <StateView kind="loading" title="Завантаження замовлення" />;
}

export function OrderDetailError({
  notFound = false,
  onBack,
  onRetry,
}: Readonly<{ notFound?: boolean; onBack: () => void; onRetry: () => void }>) {
  return notFound ? (
    <StateView
      actionLabel="Повернутися до історії"
      icon="receipt-text-remove-outline"
      kind="empty"
      onAction={onBack}
      title="Замовлення не знайдено або воно більше недоступне"
    />
  ) : (
    <StateView
      actionLabel="Повторити"
      kind="error"
      onAction={onRetry}
      title="Не вдалося завантажити замовлення"
    />
  );
}
