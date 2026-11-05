import { PhotoDownloadCard } from '@mobile/catalog/feature';
import { logout, QuickUnlockRow, useMobileSession } from '@mobile/core/auth';
import { ThemePreferenceControl, useConnectivity, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerStore } from '@mobile/customers/data-access';
import { AppText, Avatar, Button, Card } from '@mobile/shared/ui';
import { clearDeviceData } from '@mobile/sync/feature';
import { ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

// The full cabinet (photo, name, email and password, sync, queue) comes with its own stage.
export default function CabinetRoute() {
  const session = useMobileSession();
  const user = session.status === 'authenticated' ? session.user : null;
  const connectivity = useConnectivity();

  return (
    <WorkScreen title="Кабінет">
      <ScrollView contentContainerStyle={styles.content}>
        {user ? (
          <Card style={styles.account}>
            <Avatar name={user.fullName} photoUrl={user.avatarUrl} size={56} />
            <View style={styles.accountText}>
              <AppText variant="sectionTitle">{user.fullName}</AppText>
              <AppText tone="secondary" variant="secondary">
                {user.email}
              </AppText>
            </View>
          </Card>
        ) : null}
        <AppText tone="secondary" variant="caption">
          Тема
        </AppText>
        <ThemePreferenceControl />
        <QuickUnlockRow />
        <PhotoDownloadCard
          isOnline={connectivity?.isOnline ?? null}
          isUnmetered={connectivity?.isUnmetered ?? false}
        />
        <Button label="Вийти" onPress={() => void signOut()} variant="destructive" />
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
  account: { alignItems: 'center', flexDirection: 'row', gap: theme.space.md },
  accountText: { flex: 1, gap: 2 },
  content: { gap: theme.space.md, paddingBottom: theme.space.xxl },
}));
