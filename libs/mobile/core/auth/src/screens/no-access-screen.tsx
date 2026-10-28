import { AppScreen } from '@mobile/core/shell';
import { kedrSpace } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';

import { logout } from '../session/mobile-auth';

/** Shown to a signed-in account without a staff role (for example a customer). */
export function NoAccessScreen() {
  return (
    <AppScreen>
      <View style={styles.content}>
        <Icon size={48} source="lock-outline" />
        <Text accessibilityRole="header" style={styles.center} variant="headlineSmall">
          Немає доступу
        </Text>
        <Text style={styles.center} variant="bodyMedium">
          Цей обліковий запис не має доступу до застосунку менеджера. Увійдіть під обліковим записом
          співробітника.
        </Text>
        <Button mode="contained" onPress={() => void logout()}>
          Увійти під іншим обліковим записом
        </Button>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  center: { textAlign: 'center' },
  content: { alignItems: 'center', flex: 1, gap: kedrSpace.md, justifyContent: 'center' },
});
