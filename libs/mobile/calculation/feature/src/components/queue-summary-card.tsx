import { useOutbox } from '@mobile/calculation/data-access';
import { AppText, Card, createStyles, useStyles } from '@mobile/shared/ui';

/** Orders and draft changes not yet on the server; signing out deletes them (R-016, SC-023). */
export function useQueuedCount(): number {
  return useOutbox().filter((entry) => entry.state !== 'done').length;
}

/** The send queue in the cabinet: shown only while something waits or was returned. */
export function QueueSummaryCard({ isOnline }: Readonly<{ isOnline: boolean | null }>) {
  const styles = useStyles(stylesSheet);
  const entries = useOutbox().filter((entry) => entry.state !== 'done');
  if (entries.length === 0) return null;
  const returned = entries.filter((entry) => entry.state === 'needs-review').length;
  const waiting = entries.length - returned;

  return (
    <Card style={styles.card}>
      <AppText variant="bodyStrong">Черга відправлення</AppText>
      {waiting > 0 ? (
        <AppText variant="body">
          {`Чекають відправлення: ${waiting}`}
          {isOnline === true ? '' : '. Відправляться, коли зʼявиться мережа.'}
        </AppText>
      ) : null}
      {returned > 0 ? (
        <AppText tone="warning" variant="body">
          {`Повернуто на перевірку: ${returned}. Відкрийте їх у «Замовленнях».`}
        </AppText>
      ) : null}
    </Card>
  );
}

const stylesSheet = createStyles((theme) => ({
  card: { gap: theme.space.xs },
}));
