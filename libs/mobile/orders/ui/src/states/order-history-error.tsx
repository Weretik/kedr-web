import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export function OrderHistoryError({ onRetry }: Readonly<{ onRetry: () => void }>) {
  return (
    <View style={styles.state}>
      <Text accessibilityRole="alert">Не вдалося завантажити замовлення. Перевірте з’єднання.</Text>
      <Button onPress={onRetry}>Повторити</Button>
    </View>
  );
}

const styles = StyleSheet.create({ state: { alignItems: 'center', gap: 12, padding: 24 } });
