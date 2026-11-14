import {
  pickSquarePhoto,
  profileApi,
  type PickedPhoto,
  type ProfileApi,
} from '@mobile/profile/data-access';
import { roleLabel } from '@mobile/profile/model';
import { EmailForm, NameForm, PasswordForm, ProfileHeader } from '@mobile/profile/ui';
import { AppText, createStyles, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

import { CabinetProfileActions } from './cabinet-profile-actions';
import { useCabinetProfile } from '../hooks/use-cabinet-profile';

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
  const profile = useCabinetProfile({ api, onCredentialsChanged, onUserChanged, pickPhoto, user });
  const { busy, editing, error, notice } = profile;
  const online = isOnline === true;
  const close = () => profile.open(null);

  return (
    <View style={styles.container}>
      <ProfileHeader
        avatarUrl={user.avatarUrl}
        busy={busy && editing === null}
        canEdit={online}
        email={user.email}
        name={user.fullName}
        onChangePhoto={() => void profile.changePhoto()}
        onRemovePhoto={() => void profile.removePhoto()}
        roleLabel={roleLabel(user.roles)}
      />
      {editing === 'name' ? (
        <NameForm
          busy={busy}
          error={error}
          initialName={user.fullName}
          onCancel={close}
          onSave={(fullName) => void profile.saveName(fullName)}
        />
      ) : null}
      {editing === 'email' ? (
        <EmailForm
          busy={busy}
          currentEmail={user.email}
          error={error}
          onCancel={close}
          onSave={(email, password) => void profile.saveEmail(email, password)}
        />
      ) : null}
      {editing === 'password' ? (
        <PasswordForm
          busy={busy}
          error={error}
          onCancel={close}
          onSave={(current, next) => void profile.savePassword(current, next)}
        />
      ) : null}
      {editing === null ? (
        <CabinetProfileActions
          isAdmin={user.roles.includes('Admin')}
          onOpen={profile.open}
          online={online}
        />
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
  container: { gap: theme.space.md },
}));
