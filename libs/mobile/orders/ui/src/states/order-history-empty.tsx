import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export function OrderHistoryEmpty({
  filtered,
  onClear,
}: Readonly<{ filtered: boolean; onClear: () => void }>) {
  return (
    <View style={styles.state}>
      <Text>{filtered ? 'Для цього клієнта замовлень не знайдено' : 'Замовлень ще немає'}</Text>
      {filtered ? <Button onPress={onClear}>Очистити фільтр</Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({ state: { alignItems: 'center', gap: 12, padding: 24 } });
