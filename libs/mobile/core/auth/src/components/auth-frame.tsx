import { createStyles, useStyles } from '@mobile/shared/ui';
import { type ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';

/** Centered column for sign-in, unlock and «Немає доступу»; 420 dp wide on tablets. */
export function AuthFrame({ children }: Readonly<{ children: ReactNode }>) {
  const styles = useStyles(stylesSheet);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.column}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const stylesSheet = createStyles((theme, rt) => ({
  column: { alignSelf: 'center', gap: theme.space.lg, maxWidth: 420, width: '100%' },
  screen: { backgroundColor: theme.colors.background, flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: rt.insets.bottom + theme.space.xxl,
    paddingHorizontal: theme.space.xl,
    paddingTop: rt.insets.top + theme.space.xxl,
  },
}));
