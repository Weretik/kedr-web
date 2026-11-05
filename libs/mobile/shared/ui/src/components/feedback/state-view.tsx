import { ActivityIndicator, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button } from '../controls/button';
import { AppText } from '../text/app-text';
import { Icon, type IconName } from '../text/icon';

export type StateViewKind = 'empty' | 'error' | 'loading' | 'locked' | 'offline';

export interface StateViewProps {
  action?: { label: string; onPress: () => void };
  kind: StateViewKind;
  message?: string;
  title: string;
}

const icons: Record<Exclude<StateViewKind, 'loading'>, IconName> = {
  empty: 'tray-remove',
  error: 'alert-circle-outline',
  locked: 'lock-outline',
  offline: 'wifi-off',
};

/** Loading, empty, locked, offline and error states: a title, one line why, one action. */
export function StateView({ action, kind, message, title }: Readonly<StateViewProps>) {
  const { theme } = useUnistyles();

  return (
    <View
      accessibilityLiveRegion={kind === 'error' ? 'polite' : 'none'}
      accessibilityRole={kind === 'error' ? 'alert' : undefined}
      style={styles.container}
    >
      {kind === 'loading' ? (
        <ActivityIndicator color={theme.colors.brand} size="large" />
      ) : (
        <Icon name={icons[kind]} size={40} tone={kind === 'error' ? 'error' : 'secondary'} />
      )}
      <AppText accessibilityRole="header" align="center" variant="sectionTitle">
        {title}
      </AppText>
      {message ? (
        <AppText align="center" tone="secondary" variant="secondary">
          {message}
        </AppText>
      ) : null}
      {action ? <Button label={action.label} onPress={action.onPress} variant="outlined" /> : null}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: theme.space.md,
    justifyContent: 'center',
    padding: theme.space.xxl,
  },
}));
