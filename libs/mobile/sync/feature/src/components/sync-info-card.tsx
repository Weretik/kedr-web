import { AppText, Button, Card } from '@mobile/shared/ui';
import { oldestSyncedAt, type SyncFailureReason } from '@mobile/sync/model';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { formatSyncTime } from './format-sync-time';
import { useMinuteClock } from '../hooks/use-minute-clock';
import { syncStatusActions, useSyncStatus } from '../state/sync-status-store';

export interface SyncInfoCardProps {
  isOnline: boolean | null;
  /** Fixed time for tests. */
  now?: number;
}

const failureTexts: Record<SyncFailureReason, string> = {
  'invalid-data': 'Сервер надіслав дані, які не вдалося прочитати.',
  offline: 'Не вдалося оновити: немає мережі.',
  server: 'Не вдалося оновити: сервер тимчасово недоступний.',
  unauthorized: 'Не вдалося оновити: увійдіть знову.',
};

/** When the catalog and customers were last updated and «Оновити дані зараз» (R-014, R-016). */
export function SyncInfoCard({ isOnline, now }: Readonly<SyncInfoCardProps>) {
  const clock = useMinuteClock();
  const syncedAt = useSyncStatus((state) => oldestSyncedAt(state.syncedAt));
  const running = useSyncStatus((state) => state.running);
  const failure = useSyncStatus((state) => state.lastFailure);
  const time = syncedAt === null ? null : formatSyncTime(syncedAt, now ?? clock);

  return (
    <Card style={styles.card}>
      <View style={styles.text}>
        <AppText variant="bodyStrong">Дані каталогу і клієнтів</AppText>
        <AppText numeric tone="secondary" variant="secondary">
          {time ? `Оновлено ${time}` : 'Ще не оновлювалися'}
        </AppText>
        {failure && !running ? (
          <AppText tone="warning" variant="secondary">
            {failureTexts[failure]}
          </AppText>
        ) : null}
      </View>
      <Button
        disabled={isOnline !== true || running}
        icon="sync"
        label={running ? 'Оновлюємо…' : 'Оновити дані зараз'}
        loading={running}
        onPress={() => syncStatusActions.requestNow()}
        variant="outlined"
      />
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: { gap: theme.space.md },
  text: { gap: 2 },
}));
