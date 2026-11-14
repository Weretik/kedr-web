import { ListRow, useAppTheme } from '@mobile/shared/ui';
import { Switch } from 'react-native';

import { useQuickUnlockSetting } from '../unlock/quick-unlock-setting';

/** Cabinet row: open the app with a fingerprint, face or device code. */
export function QuickUnlockRow() {
  const { theme } = useAppTheme();
  const { available, enabled, setEnabled } = useQuickUnlockSetting();

  return (
    <ListRow
      subtitle={
        available
          ? 'Відбиток, обличчя або код пристрою замість пароля'
          : 'На пристрої не налаштовано відбиток, обличчя чи код'
      }
      title="Швидкий вхід"
      trailing={
        <Switch
          accessibilityLabel="Швидкий вхід"
          disabled={!available}
          onValueChange={(next) => void setEnabled(next)}
          thumbColor={theme.colors.surface}
          trackColor={{ false: theme.colors.outline, true: theme.colors.action }}
          value={enabled}
        />
      }
    />
  );
}
