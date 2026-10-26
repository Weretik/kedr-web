import { StateView } from '@mobile/shared/ui';
import { ActivityIndicator } from 'react-native-paper';

interface CustomerSelectorStateProps {
  error: boolean;
  loading: boolean;
  onRetry: () => void;
  query: string;
}

export function CustomerSelectorState({
  error,
  loading,
  onRetry,
  query,
}: Readonly<CustomerSelectorStateProps>) {
  if (loading) return <ActivityIndicator accessibilityLabel="Завантаження клієнтів" />;

  if (error)
    return (
      <StateView
        actionLabel="Повторити"
        kind="error"
        onAction={onRetry}
        title="Не вдалося завантажити клієнтів."
      />
    );

  return (
    <StateView
      actionLabel={query.trim() ? undefined : 'Оновити список'}
      icon="account-search-outline"
      kind="empty"
      onAction={query.trim() ? undefined : onRetry}
      title={
        query.trim()
          ? 'Клієнтів за цією назвою не знайдено.'
          : 'Sales API не повернув жодного клієнта.'
      }
    />
  );
}
