import { QueueSummaryCard, useQueuedCount } from '@mobile/calculation/feature';
import { PhotoDownloadCard } from '@mobile/catalog/feature';
import {
  login,
  logout,
  QuickUnlockRow,
  updateSessionUser,
  useMobileSession,
} from '@mobile/core/auth';
import { ThemePreferenceControl, useConnectivity, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerStore } from '@mobile/customers/data-access';
import { CabinetProfile, SignOutSection } from '@mobile/profile/feature';
import { AppText } from '@mobile/shared/ui';
import { clearDeviceData, SyncInfoCard } from '@mobile/sync/feature';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

/** «Кабінет»: profile, data and queue, theme, quick unlock, photos and sign-out (R-016). */
export default function CabinetRoute() {
  const session = useMobileSession();
  const user = session.status === 'authenticated' ? session.user : null;
  const connectivity = useConnectivity();
  const isOnline = connectivity?.isOnline ?? null;
  const queuedCount = useQueuedCount();

  return (
    <WorkScreen title="Кабінет">
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {user ? (
          <CabinetProfile
            isOnline={isOnline}
            onCredentialsChanged={async (email, password) => {
              await login({ email, password });
            }}
            onUserChanged={(change) => void updateSessionUser(change)}
            user={user}
          />
        ) : null}
        <SyncInfoCard isOnline={isOnline} />
        <QueueSummaryCard isOnline={isOnline} />
        <AppText tone="secondary" variant="caption">
          Тема
        </AppText>
        <ThemePreferenceControl />
        <QuickUnlockRow />
        <PhotoDownloadCard isOnline={isOnline} isUnmetered={connectivity?.isUnmetered ?? false} />
        <SignOutSection onSignOut={() => void signOut()} queuedCount={queuedCount} />
      </ScrollView>
    </WorkScreen>
  );
}

async function signOut() {
  await logout();
  clearDeviceData();
  useSelectedCustomerStore.getState().clear();
}

const styles = StyleSheet.create((theme) => ({
  content: { gap: theme.space.md, paddingBottom: theme.space.xxl },
}));
