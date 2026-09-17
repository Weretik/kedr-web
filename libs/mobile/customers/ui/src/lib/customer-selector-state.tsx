import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

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
      <View style={styles.state}>
        <Text accessibilityRole="alert">Не вдалося завантажити клієнтів.</Text>
        <Button onPress={onRetry}>Повторити</Button>
      </View>
    );

  return (
    <View style={styles.state}>
      <Text>
        {query.trim()
          ? 'Клієнтів за цією назвою не знайдено.'
          : 'Sales API не повернув жодного клієнта.'}
      </Text>
      {!query.trim() ? <Button onPress={onRetry}>Оновити список</Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: 'center', gap: 8, paddingVertical: 24, textAlign: 'center' },
});
