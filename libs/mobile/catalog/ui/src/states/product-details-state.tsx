import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text, useTheme } from 'react-native-paper';

export type ProductDetailsStateKind = 'invalid' | 'loading' | 'not_found' | 'offline' | 'error';

const messages: Record<
  Exclude<ProductDetailsStateKind, 'loading'>,
  { title: string; body: string }
> = {
  error: { title: 'Не вдалося завантажити товар', body: 'Спробуйте ще раз за кілька секунд.' },
  invalid: { title: 'Некоректне посилання', body: 'Перейдіть до товару зі списку каталогу.' },
  not_found: { title: 'Товар не знайдено', body: 'Можливо, його видалили або змінили посилання.' },
  offline: { title: 'Немає з’єднання', body: 'Перевірте інтернет і повторіть спробу.' },
};

export function ProductDetailsState({
  kind,
  onRetry,
}: Readonly<{ kind: ProductDetailsStateKind; onRetry?: () => void }>) {
  const theme = useTheme();

  if (kind === 'loading') {
    return (
      <View
        accessibilityLabel="Завантаження товару"
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator accessibilityLabel="Завантаження товару" size="large" />
        <Text variant="bodyLarge">Завантажуємо інформацію про товар…</Text>
      </View>
    );
  }

  const message = messages[kind];
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text accessibilityRole="header" variant="headlineSmall">
        {message.title}
      </Text>
      <Text style={styles.message} variant="bodyLarge">
        {message.body}
      </Text>
      {onRetry && kind !== 'invalid' && kind !== 'not_found' ? (
        <Button
          accessibilityLabel="Повторити завантаження товару"
          mode="contained"
          onPress={onRetry}
        >
          Повторити
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', flex: 1, gap: 16, justifyContent: 'center', padding: 24 },
  message: { maxWidth: 420, textAlign: 'center' },
});
