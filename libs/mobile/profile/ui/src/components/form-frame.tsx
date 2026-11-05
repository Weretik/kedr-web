import { AppText, Card } from '@mobile/shared/ui';
import { type ReactNode } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export interface FormFrameProps {
  title: string;
  error: string | null;
  busy: boolean;
  children: ReactNode;
  actions: ReactNode;
}

/** Title, fields, the error and the actions of a cabinet form; «Зберігаємо…» while it sends. */
export function FormFrame({ actions, busy, children, error, title }: Readonly<FormFrameProps>) {
  return (
    <Card style={styles.card}>
      <AppText accessibilityRole="header" variant="bodyStrong">
        {title}
      </AppText>
      {children}
      {error ? (
        <AppText accessibilityRole="alert" tone="error" variant="secondary">
          {error}
        </AppText>
      ) : null}
      <View style={styles.actions}>
        {busy ? (
          <AppText tone="secondary" variant="secondary">
            Зберігаємо…
          </AppText>
        ) : (
          actions
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.space.sm,
    justifyContent: 'flex-end',
  },
  card: { gap: theme.space.sm },
}));
