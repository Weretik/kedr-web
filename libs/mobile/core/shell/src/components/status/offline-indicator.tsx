import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { useConnectivity } from '../../providers/connectivity-context';

export function OfflineIndicator() {
  const connectivity = useConnectivity();
  const theme = useTheme();

  if (!connectivity || connectivity.isOnline) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      style={[styles.container, { backgroundColor: theme.colors.errorContainer }]}
    >
      <Text style={{ color: theme.colors.onErrorContainer }} variant="bodyMedium">
        Немає з’єднання з мережею.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
