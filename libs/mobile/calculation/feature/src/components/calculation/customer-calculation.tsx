import { CalculationLineRow, OutboxRow, ReviewBanner, UndoBar } from '@mobile/calculation/ui';
import { createStyles, StateView, useStyles } from '@mobile/shared/ui';
import { FlatList, View } from 'react-native';

import { CommentField } from './comment-field';
import { useCalculationController } from '../../hooks/use-calculation-controller';
import { useRemovedLineUndo } from '../../hooks/use-removed-line-undo';
import { SourceDraftBar } from '../draft/source-draft-bar';
import { CalculationFinish } from '../finish/calculation-finish';

interface CustomerCalculationProps {
  counterpartyId: string;
  customerName: string;
  isOnline: boolean | null;
  onOpenLine: (productId: number) => void;
}

/** The calculation of one customer: its lines, comment, outbox, and finishing steps (R-009–R-012). */
export function CustomerCalculation({
  counterpartyId,
  customerName,
  isOnline,
  onOpenLine,
}: Readonly<CustomerCalculationProps>) {
  const styles = useStyles(stylesSheet);
  const controller = useCalculationController(counterpartyId, customerName);
  const { calculation, changedIds, entries, lines, totals } = controller;
  const removed = useRemovedLineUndo(counterpartyId);

  const undo = removed ? (
    <UndoBar message={`Прибрано «${removed.name}»`} onUndo={controller.restoreRemoved} />
  ) : null;

  const queue =
    entries.length > 0 ? (
      <View style={styles.queue}>
        {entries.map((entry) => (
          <OutboxRow entry={entry} key={entry.id} />
        ))}
      </View>
    ) : null;

  if (lines.length === 0) {
    return (
      <View style={styles.container}>
        {queue}
        <StateView
          kind="empty"
          message="Додайте товари кнопкою «+» у каталозі."
          title="Розрахунок порожній"
        />
        {undo}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {calculation.review ? (
        <ReviewBanner onClose={controller.dismissReview} reason={calculation.review.reason} />
      ) : null}
      {calculation.sourceDraft ? (
        <SourceDraftBar onDelete={controller.deleteDraft} title={calculation.sourceDraft.title} />
      ) : null}
      {/* A half-open swipe belongs to its row, so FlashList recycling would show it on another product. */}
      <FlatList
        contentContainerStyle={styles.lines}
        data={lines}
        ItemSeparatorComponent={LineDivider}
        keyExtractor={(line) => line.productId.toString()}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          <View style={styles.comment}>
            <CommentField onSave={controller.setComment} value={calculation.comment ?? ''} />
          </View>
        }
        ListHeaderComponent={queue ?? undefined}
        renderItem={({ item }) => (
          <CalculationLineRow
            changed={changedIds.has(item.productId)}
            line={item}
            onOpen={onOpenLine}
            onRemove={controller.remove}
          />
        )}
      />
      {undo}
      <CalculationFinish
        customerName={customerName}
        draftTitle={calculation.sourceDraft?.title}
        isOnline={isOnline}
        onSaveDraft={controller.saveDraft}
        onSend={controller.send}
        totals={totals}
      />
    </View>
  );
}

function LineDivider() {
  const styles = useStyles(stylesSheet);
  return <View style={styles.divider} />;
}

const stylesSheet = createStyles((theme) => ({
  comment: { paddingTop: theme.space.md },
  container: { flex: 1, gap: theme.space.sm },
  divider: { backgroundColor: theme.colors.outlineVariant, height: theme.sizes.border },
  lines: { paddingBottom: theme.space.lg },
  queue: { gap: theme.space.xs, paddingBottom: theme.space.sm },
}));
