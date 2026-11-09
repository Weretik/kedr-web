import {
  pickSquarePhoto,
  profileApi,
  ProfileError,
  type PickedPhoto,
  type ProfileApi,
} from '@mobile/profile/data-access';
import { profileErrorMessage, roleLabel } from '@mobile/profile/model';
import { EmailForm, NameForm, PasswordForm, ProfileHeader } from '@mobile/profile/ui';
import { AppText, Button, createStyles, useStyles } from '@mobile/shared/ui';
import { useState } from 'react';
import { View } from 'react-native';

export interface CabinetUser {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  roles: readonly string[];
}

export interface CabinetProfileProps {
  user: CabinetUser;
  isOnline: boolean | null;
  /** Keeps the saved session in step after a name, photo or e-mail change. */
  onUserChanged: (change: Partial<Pick<CabinetUser, 'avatarUrl' | 'email' | 'fullName'>>) => void;
  /** The server ends every session after an e-mail or password change; the app signs in again with the new data. */
  onCredentialsChanged: (email: string, password: string) => Promise<void>;
  /** Tests replace the server and the gallery. */
  api?: ProfileApi;
  pickPhoto?: () => Promise<PickedPhoto | null>;
}

type Editing = 'email' | 'name' | 'password' | null;

const messageOf = (error: unknown) =>
  error instanceof ProfileError
    ? profileErrorMessage(error.failure)
    : 'Не вдалося зберегти. Спробуйте ще раз.';

/**
 * Photo, name, role and e-mail for everyone; an Admin also changes the sign-in e-mail and password with the
 * current password, as in the Admin (R-016, SC-021, SC-022).
 */
export function CabinetProfile({
  api = profileApi,
  isOnline,
  onCredentialsChanged,
  onUserChanged,
  pickPhoto = pickSquarePhoto,
  user,
}: Readonly<CabinetProfileProps>) {
  const styles = useStyles(stylesSheet);
  const [editing, setEditing] = useState<Editing>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const online = isOnline === true;
  const isAdmin = user.roles.includes('Admin');

  const run = async (action: () => Promise<string>) => {
    setBusy(true);
    setError(null);
    setNotice(null);
    // No `finally`: React Compiler cannot compile it yet, and both branches end the same way.
    try {
      setNotice(await action());
      setEditing(null);
    } catch (failure) {
      setError(messageOf(failure));
    }
    setBusy(false);
  };

  const open = (next: Editing) => {
    setError(null);
    setNotice(null);
    setEditing(next);
  };

  const changePhoto = async () => {
    const photo = await pickPhoto();
    if (!photo) return;
    await run(async () => {
      onUserChanged({ avatarUrl: await api.uploadAvatar(photo) });
      return 'Фото змінено.';
    });
  };

  return (
    <View style={styles.container}>
      <ProfileHeader
        avatarUrl={user.avatarUrl}
        busy={busy && editing === null}
        canEdit={online}
        email={user.email}
        name={user.fullName}
        onChangePhoto={() => void changePhoto()}
        onRemovePhoto={() =>
          void run(async () => {
            await api.removeAvatar();
            onUserChanged({ avatarUrl: null });
            return 'Фото прибрано.';
          })
        }
        roleLabel={roleLabel(user.roles)}
      />
      {editing === 'name' ? (
        <NameForm
          busy={busy}
          error={error}
          initialName={user.fullName}
          onCancel={() => open(null)}
          onSave={(fullName) =>
            void run(async () => {
              await api.changeName(fullName);
              onUserChanged({ fullName });
              return 'Імʼя змінено.';
            })
          }
        />
      ) : null}
      {editing === 'email' ? (
        <EmailForm
          busy={busy}
          currentEmail={user.email}
          error={error}
          onCancel={() => open(null)}
          onSave={(email, password) =>
            void run(async () => {
              await api.changeEmail(email, password);
              onUserChanged({ email });
              await onCredentialsChanged(email, password);
              return 'E-mail змінено.';
            })
          }
        />
      ) : null}
      {editing === 'password' ? (
        <PasswordForm
          busy={busy}
          error={error}
          onCancel={() => open(null)}
          onSave={(current, next) =>
            void run(async () => {
              await api.changePassword(current, next);
              await onCredentialsChanged(user.email, next);
              return 'Пароль змінено.';
            })
          }
        />
      ) : null}
      {editing === null ? (
        <View style={styles.actions}>
          <Button
            disabled={!online}
            label="Змінити імʼя"
            onPress={() => open('name')}
            variant="outlined"
          />
          {isAdmin ? (
            <>
              <Button
                disabled={!online}
                label="Змінити e-mail"
                onPress={() => open('email')}
                variant="outlined"
              />
              <Button
                disabled={!online}
                label="Змінити пароль"
                onPress={() => open('password')}
                variant="outlined"
              />
            </>
          ) : null}
        </View>
      ) : null}
      {!online ? (
        <AppText tone="secondary" variant="secondary">
          Зміни профілю зберігаються, коли є мережа.
        </AppText>
      ) : null}
      {editing === null && error ? (
        <AppText accessibilityRole="alert" tone="error" variant="secondary">
          {error}
        </AppText>
      ) : null}
      {notice ? (
        <AppText accessibilityLiveRegion="polite" tone="success" variant="secondary">
          {notice}
        </AppText>
      ) : null}
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
  container: { gap: theme.space.md },
}));
