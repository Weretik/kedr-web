import { StateView } from '@mobile/shared/ui';
import { View } from 'react-native';

export function OrderHistoryError({ onRetry }: Readonly<{ onRetry: () => void }>) {
  return (
    <View accessibilityRole="alert" style={{ flex: 1 }}>
      <StateView
        actionLabel="Повторити"
        kind="error"
        onAction={onRetry}
        title="Не вдалося завантажити замовлення. Перевірте з’єднання."
      />
    </View>
  );
}
