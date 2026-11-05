import { SegmentedControl } from '@mobile/shared/ui';

import { useThemePreference, type ThemePreference } from './theme-preference-store';

const segments = [
  { label: 'Як у системі', value: 'system' },
  { label: 'Світла', value: 'light' },
  { label: 'Темна', value: 'dark' },
] as const satisfies readonly { label: string; value: ThemePreference }[];

export function ThemePreferenceControl() {
  const preference = useThemePreference((state) => state.preference);
  const setPreference = useThemePreference((state) => state.setPreference);

  return (
    <SegmentedControl
      accessibilityLabel="Тема"
      onChange={setPreference}
      segments={segments}
      value={preference}
    />
  );
}
