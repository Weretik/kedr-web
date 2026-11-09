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
import { AppText, createStyles, useBreakpoint, useStyles } from '@mobile/shared/ui';
import { clearDeviceData, SyncInfoCard } from '@mobile/sync/feature';
import { ScrollView, View } from 'react-native';

/** «Кабінет»: profile, data and queue, theme, quick unlock, photos and sign-out (R-016). */
export default function CabinetRoute() {
  const styles = useStyles(stylesSheet);
  const session = useMobileSession();
  const user = session.status === 'authenticated' ? session.user : null;
  const connectivity = useConnectivity();
  const isOnline = connectivity?.isOnline ?? null;
  const queuedCount = useQueuedCount();

  // A tablet puts the profile on the left and the device settings on the right (R-017).
  const isPhone = useBreakpoint() === 'phone';

  const profile = user ? (
    <CabinetProfile
      isOnline={isOnline}
      onCredentialsChanged={async (email, password) => {
        await login({ email, password });
      }}
      onUserChanged={(change) => void updateSessionUser(change)}
      user={user}
    />
  ) : null;
  const device = (
    <>
      <SyncInfoCard isOnline={isOnline} />
      <QueueSummaryCard isOnline={isOnline} />
      <AppText tone="secondary" variant="caption">
        Тема
      </AppText>
      <ThemePreferenceControl />
      <QuickUnlockRow />
      <PhotoDownloadCard isOnline={isOnline} isUnmetered={connectivity?.isUnmetered ?? false} />
    </>
  );
  const signOutSection = (
    <SignOutSection onSignOut={() => void signOut()} queuedCount={queuedCount} />
  );

  return (
    <WorkScreen title="Кабінет">
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {isPhone ? (
          <>
            {profile}
            {device}
            {signOutSection}
          </>
        ) : (
          <View style={styles.columns}>
            <View style={styles.column}>
              {profile}
              {signOutSection}
            </View>
            <View style={styles.column}>{device}</View>
          </View>
        )}
      </ScrollView>
    </WorkScreen>
  );
}

async function signOut() {
  await logout();
  clearDeviceData();
  useSelectedCustomerStore.getState().clear();
}

const stylesSheet = createStyles((theme) => ({
  column: { flex: 1, gap: theme.space.md, maxWidth: 560 },
  columns: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.space.xl },
  content: { gap: theme.space.md, paddingBottom: theme.space.xxl },
}));
