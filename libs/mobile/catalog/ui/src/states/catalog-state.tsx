import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export type CatalogStateKind = 'empty' | 'error' | 'loading' | 'offline';

export interface CatalogStateProps {
  actionAccessibilityLabel?: string;
  actionLabel?: string;
  kind: CatalogStateKind;
  onAction?: () => void;
  onRetry?: () => void;
}

const stateContent: Record<CatalogStateKind, { description: string; title: string }> = {
  empty: {
    description: 'Спробуйте оновити каталог трохи пізніше.',
    title: 'Товарів поки немає',
  },
  error: {
    description: 'Не вдалося завантажити каталог. Перевірте з’єднання та повторіть спробу.',
    title: 'Сталася помилка',
  },
  loading: {
    description: 'Завантажуємо товари.',
    title: 'Завантаження каталогу',
  },
  offline: {
    description: 'Під’єднайтеся до мережі, щоб завантажити каталог.',
    title: 'Немає з’єднання',
  },
};

export function CatalogState({
  actionAccessibilityLabel,
  actionLabel,
  kind,
  onAction,
  onRetry,
}: Readonly<CatalogStateProps>) {
  const theme = useTheme();
  const { description, title } = stateContent[kind];

  return (
    <View
      accessibilityRole={kind === 'error' || kind === 'offline' ? 'alert' : undefined}
      style={styles.container}
      testID={`catalog-state-${kind}`}
    >
      {kind === 'loading' ? <ActivityIndicator accessibilityLabel="Завантаження" color={theme.colors.primary} size="large" /> : null}
      <Text accessibilityRole="header" variant="titleLarge">
        {title}
      </Text>
      <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyLarge">
        {description}
      </Text>
      {onRetry && kind !== 'loading' ? (
        <Pressable
          accessibilityLabel="Повторити спробу"
          accessibilityRole="button"
          onPress={onRetry}
          style={[styles.retryButton, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Text style={{ color: theme.colors.onPrimaryContainer }} variant="labelLarge">
            Повторити
          </Text>
        </Pressable>
      ) : onAction && actionLabel ? (
        <Pressable
          accessibilityLabel={actionAccessibilityLabel ?? actionLabel}
          accessibilityRole="button"
          onPress={onAction}
          style={[styles.retryButton, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Text style={{ color: theme.colors.onPrimaryContainer }} variant="labelLarge">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  retryButton: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
});
