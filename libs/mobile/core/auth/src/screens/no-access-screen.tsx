import { Button, StateView } from '@mobile/shared/ui';
import { View } from 'react-native';

import { AuthFrame } from '../components/auth-frame';
import { logout } from '../session/mobile-auth';

/** A signed-in account without the Manager or Admin role (R-001, SC-002). */
export function NoAccessScreen() {
  return (
    <AuthFrame>
      <View>
        <StateView
          kind="locked"
          message="Цей обліковий запис не має доступу до застосунку менеджера. Увійдіть під обліковим записом співробітника."
          title="Немає доступу"
        />
      </View>
      <Button label="Вийти" onPress={() => void logout()} variant="outlined" />
    </AuthFrame>
  );
}
