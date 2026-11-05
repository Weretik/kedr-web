import { formatKopecks } from '@mobile/shared/model';
import { AppText, ListRow, StatusPill } from '@mobile/shared/ui';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { OutboxEntry } from '@mobile/calculation/model';

export interface OutboxRowProps {
  entry: OutboxEntry;
  /** A returned entry opens in the calculation. */
  onOpen?: () => void;
}

const titles: Record<OutboxEntry['kind'], string> = {
  'draft-delete': 'Видалення чернетки',
  'draft-save': 'Чернетка',
  'order-create': 'Замовлення',
};

function titleOf(entry: OutboxEntry): string {
  if (entry.kind === 'order-create' && entry.orderNumber) return `№ ${entry.orderNumber}`;
  if (entry.kind === 'draft-save') return `${titles['draft-save']} «${entry.payload.title}»`;
  return titles[entry.kind];
}

/**
 * An order or draft change on its way to the server: «У черзі» until sent, the number once created, or the
 * server's reason when returned (R-011, R-012, SC-016).
 */
export function OutboxRow({ entry, onOpen }: Readonly<OutboxRowProps>) {
  const total = entry.kind === 'order-create' ? formatKopecks(entry.payload.totalKopecks) : null;
  const subtitle =
    entry.state === 'needs-review'
      ? (entry.lastError ?? 'Потрібна перевірка')
      : entry.state === 'pending' && entry.lastError
        ? `Повтор: ${entry.lastError}`
        : undefined;

  return (
    <ListRow
      accessibilityHint={
        entry.state === 'needs-review' ? 'Відкриває розрахунок для перевірки' : undefined
      }
      onPress={entry.state === 'needs-review' ? onOpen : undefined}
      opensDetail={entry.state === 'needs-review' && onOpen !== undefined}
      subtitle={subtitle}
      title={titleOf(entry)}
      trailing={
        <View style={styles.trailing}>
          {total ? (
            <AppText numeric variant="bodyStrong">
              {total}
            </AppText>
          ) : null}
          {entry.state === 'pending' ? <StatusPill kind="informational" label="У черзі" /> : null}
          {entry.state === 'needs-review' ? (
            <StatusPill kind="warning" label="Потрібна перевірка" />
          ) : null}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create((theme) => ({
  trailing: { alignItems: 'flex-end', gap: theme.space.xs },
}));
