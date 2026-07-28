import { useState } from 'react';
import { IconButton, Menu } from 'react-native-paper';

import { useThemePreference } from '../../providers/theme-preference-context';
import { type ThemePreference } from '../../storage/theme-preference-storage';

const preferences: readonly { label: string; value: ThemePreference }[] = [
  { label: 'Системна', value: 'system' },
  { label: 'Світла', value: 'light' },
  { label: 'Темна', value: 'dark' },
];

export function ThemePreferenceHeaderControl() {
  const [isVisible, setIsVisible] = useState(false);
  const { preference, setPreference } = useThemePreference();

  const selectPreference = (nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    setIsVisible(false);
  };

  return (
    <Menu
      anchor={
        <IconButton
          accessibilityLabel="Змінити тему оформлення"
          icon="theme-light-dark"
          onPress={() => setIsVisible(true)}
        />
      }
      onDismiss={() => setIsVisible(false)}
      visible={isVisible}
    >
      {preferences.map(({ label, value }) => (
        <Menu.Item
          key={value}
          leadingIcon={preference === value ? 'check' : undefined}
          onPress={() => selectPreference(value)}
          title={label}
        />
      ))}
    </Menu>
  );
}
