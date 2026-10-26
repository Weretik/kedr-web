import { Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';

export type MissingPhotoProductsStateKind = 'empty' | 'error' | 'loading';

export interface MissingPhotoProductsStateProps {
  kind: MissingPhotoProductsStateKind;
  onRetry?: () => void;
}

const content: Record<MissingPhotoProductsStateKind, { description: string; title: string }> = {
  empty: {
    description: 'Список не потребує уваги.',
    title: 'Усі товари мають фотографії',
  },
  error: {
    description: 'Перевірте з’єднання та повторіть спробу.',
    title: 'Не вдалося завантажити товари без фотографій',
  },
  loading: {
    description: 'Отримуємо актуальний список.',
    title: 'Завантаження',
  },
};

export function MissingPhotoProductsState({
  kind,
  onRetry,
}: Readonly<MissingPhotoProductsStateProps>) {
  const theme = useTheme();
  const state = content[kind];

  return (
    <View
      accessibilityRole={kind === 'error' ? 'alert' : undefined}
      style={styles.container}
      testID={`missing-photo-products-state-${kind}`}
    >
      {kind === 'loading' ? (
        <ActivityIndicator
          accessibilityLabel="Завантаження товарів без фотографій"
          color={theme.colors.primary}
          size="large"
        />
      ) : null}
      <Text accessibilityRole="header" variant="titleLarge">
        {state.title}
      </Text>
      <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyLarge">
        {state.description}
      </Text>
      {kind === 'error' && onRetry ? (
        <Pressable
          accessibilityLabel="Повторити"
          accessibilityRole="button"
          onPress={onRetry}
          style={[styles.retryButton, { backgroundColor: theme.colors.inverseSurface }]}
        >
          <Text style={{ color: theme.colors.inverseOnSurface }} variant="labelLarge">
            Повторити
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
    paddingHorizontal: 16,
  },
  retryButton: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
});
