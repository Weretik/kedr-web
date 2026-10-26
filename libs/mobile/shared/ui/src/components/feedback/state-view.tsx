import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Icon, Text } from 'react-native-paper';

import { useKedrTheme } from '../../theme/kedr-theme';

export type StateViewKind = 'empty' | 'error' | 'loading' | 'offline';

export interface StateViewProps {
  actionLabel?: string;
  icon?: string;
  kind: StateViewKind;
  message?: string;
  onAction?: () => void;
  testID?: string;
  title: string;
}

const defaultIcons: Record<Exclude<StateViewKind, 'loading'>, string> = {
  empty: 'package-variant',
  error: 'alert-circle-outline',
  offline: 'wifi-off',
};

/** Centered loading, empty, error, or offline state with an optional action. */
export function StateView({
  actionLabel,
  icon,
  kind,
  message,
  onAction,
  testID,
  title,
}: Readonly<StateViewProps>) {
  const { kedr } = useKedrTheme();
  const tint = kind === 'error' ? kedr.colors.status.error : null;

  return (
    <View
      accessibilityLiveRegion={kind === 'error' ? 'polite' : undefined}
      style={styles.root}
      testID={testID}
    >
      <View
        style={[
          styles.badge,
          {
            backgroundColor: tint?.background ?? kedr.colors.surfaceVariant,
            borderRadius: kedr.radius.lg,
          },
        ]}
      >
        {kind === 'loading' ? (
          <ActivityIndicator accessibilityLabel={title} color={kedr.colors.primary} />
        ) : (
          <Icon
            color={tint?.foreground ?? kedr.colors.primary}
            size={30}
            source={icon ?? defaultIcons[kind]}
          />
        )}
      </View>
      <Text
        accessibilityRole="header"
        style={[styles.center, { color: kedr.colors.onSurface }]}
        variant="titleMedium"
      >
        {title}
      </Text>
      {message ? (
        <Text style={[styles.center, { color: kedr.colors.onSurfaceVariant }]} variant="bodyMedium">
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          buttonColor={kedr.colors.inverseSurface}
          mode="contained"
          onPress={onAction}
          style={styles.action}
          textColor={kedr.colors.inverseOnSurface}
        >
          {actionLabel}
        </Button>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  action: { marginTop: 8 },
  badge: { alignItems: 'center', height: 64, justifyContent: 'center', marginBottom: 4, width: 64 },
  center: { maxWidth: 320, textAlign: 'center' },
  root: { alignItems: 'center', flex: 1, gap: 8, justifyContent: 'center', padding: 24 },
});
