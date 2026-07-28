import { useThemePreference } from '../../providers/theme-preference-context';
import { AppScreen } from '../layout/app-screen';
import { ShellState } from '../status/shell-state';

const preferenceLabels = {
  dark: 'Темна',
  light: 'Світла',
  system: 'Системна',
} as const;

export function ThemePreferenceScreen() {
  const { preference } = useThemePreference();

  return (
    <AppScreen edges={['top', 'left', 'right']}>
      <ShellState
        description={`Профіль користувача буде доступний незабаром. Поточна тема: ${preferenceLabels[preference]}.`}
        kind="empty"
        title="Профіль"
      />
    </AppScreen>
  );
}
