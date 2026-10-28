import { KedrSheet, RoundIconButton, kedrSpace } from '@mobile/shared/ui';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { logout } from '../session/mobile-auth';
import { useMobileSession } from '../session/use-mobile-session';

const roleLabel = (roles: readonly string[]) =>
  roles.includes('Admin') ? 'Адміністратор' : 'Менеджер';

/** Header button with the signed-in user and sign-out. */
export function AccountHeaderControl({
  tone = 'surface',
}: Readonly<{ tone?: 'onPrimary' | 'surface' }>) {
  const [isVisible, setIsVisible] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const session = useMobileSession();

  if (session.status !== 'authenticated') return null;
  const { user } = session;

  const signOut = async () => {
    setSigningOut(true);
    try {
      await logout();
    } finally {
      setSigningOut(false);
      setIsVisible(false);
    }
  };

  return (
    <>
      <RoundIconButton
        accessibilityLabel="Обліковий запис"
        icon="account-circle-outline"
        onPress={() => setIsVisible(true)}
        tone={tone}
      />
      <KedrSheet onDismiss={() => setIsVisible(false)} title="Обліковий запис" visible={isVisible}>
        <View style={styles.content}>
          <Text variant="titleMedium">{user.fullName || user.email}</Text>
          <Text variant="bodyMedium">
            {user.email} · {roleLabel(user.roles)}
          </Text>
          <Button
            disabled={signingOut}
            loading={signingOut}
            mode="contained-tonal"
            onPress={() => void signOut()}
          >
            Вийти
          </Button>
        </View>
      </KedrSheet>
    </>
  );
}

const styles = StyleSheet.create({
  content: { gap: kedrSpace.md },
});
