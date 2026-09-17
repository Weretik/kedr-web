import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export function OrderHistoryLoading() {
  return (
    <View style={styles.state}>
      <ActivityIndicator accessibilityLabel="Завантаження замовлень" />
    </View>
  );
}

const styles = StyleSheet.create({ state: { alignItems: 'center', padding: 24 } });
