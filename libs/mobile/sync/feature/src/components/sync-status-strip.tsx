import { AppText, createStyles, Icon, useStyles } from '@mobile/shared/ui';
import { isStale, oldestSyncedAt } from '@mobile/sync/model';
import { View } from 'react-native';

import { formatSyncTime } from './format-sync-time';
import { useMinuteClock } from '../hooks/use-minute-clock';
import { useSyncStatus } from '../state/sync-status-store';

export interface SyncStatusStripProps {
  isOnline: boolean | null;
  /** Fixed time for tests; the strip otherwise follows a clock that ticks every minute. */
  now?: number;
  /** `bar` above the phone tab bar, `rail` under the tablet rail items (narrow, two lines). */
  layout: 'bar' | 'rail';
}

/**
 * «Без мережі · дані від 14:05» while offline, «Оновлюємо дані…» while a sync of old data runs (R-014).
 * Normal offline work is not an error, so the strip is neutral; it shows nothing when data is fresh.
 */
export function SyncStatusStrip({ isOnline, layout, now }: Readonly<SyncStatusStripProps>) {
  const styles = useStyles(stylesSheet);
  const clock = useMinuteClock();
  const at = now ?? clock;
  const syncedAt = useSyncStatus((state) => oldestSyncedAt(state.syncedAt));
  const running = useSyncStatus((state) => state.running);

  const offline = isOnline === false;
  if (!offline && !(running && isStale(syncedAt, at))) return null;

  const time = syncedAt === null ? null : formatSyncTime(syncedAt, at);
  const title = offline ? 'Без мережі' : 'Оновлюємо дані…';
  const detail = offline && time ? `дані від ${time}` : null;

  return (
    <View
      accessibilityLabel={detail ? `${title}, ${detail}` : title}
      accessibilityLiveRegion="polite"
      style={styles.strip(layout)}
      testID="sync-status-strip"
    >
      <Icon name={offline ? 'wifi-off' : 'sync'} size={16} tone="secondary" />
      {layout === 'bar' ? (
        <AppText numberOfLines={1} tone="secondary" variant="caption">
          {detail ? `${title} · ${detail}` : title}
        </AppText>
      ) : (
        <AppText align="center" numberOfLines={3} tone="secondary" variant="caption">
          {detail ? `${title}\n${time}` : title}
        </AppText>
      )}
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  strip: (layout: 'bar' | 'rail') =>
    layout === 'bar'
      ? {
          alignItems: 'center',
          backgroundColor: theme.colors.surfaceMuted,
          flexDirection: 'row',
          gap: theme.space.sm,
          justifyContent: 'center',
          minHeight: 28,
          paddingHorizontal: theme.space.lg,
        }
      : {
          alignItems: 'center',
          gap: theme.space.xs,
          paddingHorizontal: theme.space.xs,
          paddingVertical: theme.space.sm,
        },
}));
