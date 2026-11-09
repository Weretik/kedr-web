import {
  CalculationFooter,
  CalculationLineRow,
  OutboxRow,
  ReviewBanner,
  UndoBar,
} from '@mobile/calculation/ui';
import { useSelectedCustomer } from '@mobile/customers/data-access';
import { formatDate } from '@mobile/shared/model';
import { AppText, Button, createStyles, StateView, useStyles } from '@mobile/shared/ui';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

import { CommentField } from './comment-field';
import { ConfirmSend, SaveDraftForm } from './finish-step';
import { useCalculationController } from '../hooks/use-calculation-controller';
import { useRemovedLineStore } from '../hooks/use-removed-line';

export interface CalculationPanelProps {
  isOnline: boolean | null;
  /** Opens one line's quantity and price, usually as a sheet. */
  onOpenLine: (productId: number) => void;
}

/** How long «Скасувати» stays after a line is removed. */
const undoMs = 5_000;

type Step = 'confirm' | 'draft' | 'edit';

/**
 * The chosen customer's calculation as a compact work sheet: one line per product (a tap opens quantity and price, a
 * swipe removes it with «Скасувати»), the comment, and under the list the total, «Чернетка» and «Відправити в 1С»,
 * plus what is on its way to the server (R-009–R-012). On a wide tablet it stands next to the products (R-017).
 */
export function CalculationPanel({ isOnline, onOpenLine }: Readonly<CalculationPanelProps>) {
  const customer = useSelectedCustomer();
  if (!customer) return null;
  return (
    <CustomerCalculation
      counterpartyId={customer.counterpartyId}
      customerName={customer.name}
      isOnline={isOnline}
      key={customer.counterpartyId}
      onOpenLine={onOpenLine}
    />
  );
}

function CustomerCalculation({
  counterpartyId,
  customerName,
  isOnline,
  onOpenLine,
}: Readonly<{
  counterpartyId: string;
  customerName: string;
  isOnline: boolean | null;
  onOpenLine: (productId: number) => void;
}>) {
  const styles = useStyles(stylesSheet);
  const controller = useCalculationController(counterpartyId, customerName);
  const { calculation, changedIds, entries, lines, totals } = controller;
  const [step, setStep] = useState<Step>('edit');
  const removed = useRemovedLineStore((state) =>
    state.removed?.counterpartyId === counterpartyId ? state.removed : null,
  );

  useEffect(() => {
    if (!removed) return;
    const timer = setTimeout(() => useRemovedLineStore.getState().forget(), undoMs);
    return () => clearTimeout(timer);
  }, [removed]);

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
        <View style={styles.draft}>
          <AppText style={styles.draftTitle} tone="secondary" variant="secondary">
            {`Чернетка «${calculation.sourceDraft.title}»`}
          </AppText>
          <Button label="Видалити чернетку" onPress={controller.deleteDraft} variant="text" />
        </View>
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
      {step === 'edit' ? (
        <CalculationFooter
          onSaveDraft={() => setStep('draft')}
          onSend={() => setStep('confirm')}
          totals={totals}
        />
      ) : null}
      {step === 'confirm' ? (
        <ConfirmSend
          customerName={customerName}
          isOnline={isOnline}
          lineCount={totals.lineCount}
          onCancel={() => setStep('edit')}
          onConfirm={() => {
            controller.send();
            setStep('edit');
          }}
          totalKopecks={totals.totalKopecks}
        />
      ) : null}
      {step === 'draft' ? (
        <SaveDraftForm
          initialTitle={
            calculation.sourceDraft?.title ||
            `${customerName}, ${formatDate(new Date().toISOString())}`
          }
          onCancel={() => setStep('edit')}
          onSave={(title) => {
            controller.saveDraft(title);
            setStep('edit');
          }}
        />
      ) : null}
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
  draft: { alignItems: 'center', flexDirection: 'row', gap: theme.space.sm },
  draftTitle: { flex: 1 },
  lines: { paddingBottom: theme.space.lg },
  queue: { gap: theme.space.xs, paddingBottom: theme.space.sm },
}));
