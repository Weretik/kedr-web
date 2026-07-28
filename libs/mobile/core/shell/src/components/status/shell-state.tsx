import { useEffect, useRef } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { useAppNotifier } from '../../providers/notification-context';

export type ShellStateKind = 'loading' | 'empty' | 'error';

export interface ShellStateProps {
  description: string;
  kind: ShellStateKind;
  onRetry?: () => void;
  title: string;
}

export function ShellState({ description, kind, onRetry, title }: Readonly<ShellStateProps>) {
  const notifier = useAppNotifier();
  const theme = useTheme();
  const announcedError = useRef<string | null>(null);

  useEffect(() => {
    if (kind === 'error' && announcedError.current !== description) {
      notifier.showError(description);
      announcedError.current = description;
    }

    if (kind !== 'error') {
      announcedError.current = null;
    }
  }, [description, kind, notifier]);

  return (
    <View
      accessibilityRole={kind === 'error' ? 'alert' : undefined}
      style={styles.container}
      testID={`shell-state-${kind}`}
    >
      {kind === 'loading' ? (
        <ActivityIndicator
          accessibilityLabel="Завантаження"
          color={theme.colors.primary}
          size="large"
        />
      ) : null}
      <Text accessibilityRole="header" variant="titleLarge">
        {title}
      </Text>
      <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyLarge">
        {description}
      </Text>
      {kind === 'error' && onRetry ? (
        <Pressable
          accessibilityLabel="Повторити спробу"
          accessibilityRole="button"
          onPress={onRetry}
          style={[styles.retryButton, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Text style={{ color: theme.colors.onPrimaryContainer }} variant="labelLarge">
            Повторити
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
  },
  retryButton: {
    alignItems: 'center',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
  },
});
