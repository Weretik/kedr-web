import { createStyles, StateView, useStyles } from '@mobile/shared/ui';
import { oldestSyncedAt } from '@mobile/sync/model';
import { View } from 'react-native';

import { syncStatusActions, useSyncStatus } from '../state/sync-status-store';

import type { ReactNode } from 'react';

export interface SyncGateProps {
  children: ReactNode;
  isOnline: boolean | null;
}

/**
 * Holds the working area until the device has the catalog and customers once (first sync with progress, R-015).
 * After that it never blocks: later syncs run in the background.
 */
export function SyncGate({ children, isOnline }: Readonly<SyncGateProps>) {
  const styles = useStyles(stylesSheet);
  const loaded = useSyncStatus((state) => state.loaded);
  const hasData = useSyncStatus((state) => oldestSyncedAt(state.syncedAt) !== null);
  const running = useSyncStatus((state) => state.running);
  const lastFailure = useSyncStatus((state) => state.lastFailure);

  if (loaded && hasData) return children;

  let state: ReactNode;
  if (!loaded || running || (isOnline === null && !lastFailure)) {
    state = (
      <StateView
        kind="loading"
        message="Каталог, ціни й клієнти зберігаються на пристрої для роботи без мережі."
        title="Завантажуємо дані…"
      />
    );
  } else if (isOnline === false) {
    state = (
      <StateView
        kind="offline"
        message="Перше завантаження потребує інтернету. Далі можна працювати без мережі."
        title="Немає мережі"
      />
    );
  } else {
    state = (
      <StateView
        action={{ label: 'Спробувати ще', onPress: () => syncStatusActions.requestNow() }}
        kind="error"
        message="Не вдалося завантажити каталог і клієнтів. Перевірте з'єднання."
        title="Дані не завантажено"
      />
    );
  }

  return <View style={styles.screen}>{state}</View>;
}

const stylesSheet = createStyles((theme, rt) => ({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    paddingBottom: rt.insets.bottom,
    paddingTop: rt.insets.top,
  },
}));
