import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';

export function OrderDetailLoading() {
  return (
    <View style={styles.state}>
      <ActivityIndicator accessibilityLabel="Завантаження замовлення" />
    </View>
  );
}
export function OrderDetailError({
  notFound = false,
  onBack,
  onRetry,
}: Readonly<{ notFound?: boolean; onBack: () => void; onRetry: () => void }>) {
  return (
    <View style={styles.state}>
      <Text accessibilityRole="alert">
        {notFound
          ? 'Замовлення не знайдено або воно більше недоступне'
          : 'Не вдалося завантажити замовлення'}
      </Text>
      {notFound ? (
        <Button onPress={onBack}>Повернутися до історії</Button>
      ) : (
        <Button onPress={onRetry}>Повторити</Button>
      )}
    </View>
  );
}
const styles = StyleSheet.create({ state: { alignItems: 'center', gap: 12, padding: 24 } });
