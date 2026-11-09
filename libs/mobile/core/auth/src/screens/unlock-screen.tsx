import { AppText, Avatar, BrandMark, Button, createStyles, useStyles } from '@mobile/shared/ui';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { AuthFrame } from '../components/auth-frame';
import { logout, unlockSession } from '../session/mobile-auth';

import type { SessionUser } from '../session/session-user';

/** Saved session behind quick unlock; the manager can also sign in with the password. */
export function UnlockScreen({ user }: Readonly<{ user: SessionUser }>) {
  const styles = useStyles(stylesSheet);
  const [failed, setFailed] = useState(false);

  const unlock = async () => setFailed(!(await unlockSession()));

  // Ask for the fingerprint or face as soon as the screen opens.
  useEffect(() => {
    let active = true;
    void unlockSession().then((opened) => {
      if (active) setFailed(!opened);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthFrame>
      <BrandMark size={56} />
      <View style={styles.user}>
        <Avatar name={user.fullName} photoUrl={user.avatarUrl} size={56} />
        <View style={styles.userText}>
          <AppText variant="sectionTitle">{user.fullName}</AppText>
          <AppText tone="secondary" variant="secondary">
            {user.email}
          </AppText>
        </View>
      </View>
      {failed ? (
        <AppText accessibilityLiveRegion="polite" tone="error" variant="secondary">
          Не вдалося розблокувати. Спробуйте ще раз або увійдіть паролем.
        </AppText>
      ) : null}
      <Button icon="fingerprint" label="Розблокувати" onPress={() => void unlock()} />
      <Button label="Увійти паролем" onPress={() => void logout()} variant="outlined" />
    </AuthFrame>
  );
}

const stylesSheet = createStyles((theme) => ({
  user: { alignItems: 'center', flexDirection: 'row', gap: theme.space.md },
  userText: { flex: 1, gap: 2 },
}));
