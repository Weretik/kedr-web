import {
  CalculationFooter,
  CalculationLineRow,
  OutboxRow,
  ReviewBanner,
} from '@mobile/calculation/ui';
import { useSelectedCustomer } from '@mobile/customers/data-access';
import { formatDate } from '@mobile/shared/model';
import { AppText, Button, StateView, TextField } from '@mobile/shared/ui';
import { useState } from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ConfirmSend, SaveDraftForm } from './finish-step';
import { useCalculationController } from '../hooks/use-calculation-controller';

export interface CalculationPanelProps {
  isOnline: boolean | null;
}

type Step = 'confirm' | 'draft' | 'edit';

/**
 * The chosen customer's calculation: lines with quantity and «± ₴/шт», comment, totals, «Чернетка» and
 * «Відправити в 1С», and what is on its way to the server (R-009–R-012). On a wide tablet it stands next to the
 * products (R-017).
 */
export function CalculationPanel({ isOnline }: Readonly<CalculationPanelProps>) {
  const customer = useSelectedCustomer();
  if (!customer) return null;
  return (
    <CustomerCalculation
      counterpartyId={customer.counterpartyId}
      customerName={customer.name}
      isOnline={isOnline}
      key={customer.counterpartyId}
    />
  );
}

function CustomerCalculation({
  counterpartyId,
  customerName,
  isOnline,
}: Readonly<{ counterpartyId: string; customerName: string; isOnline: boolean | null }>) {
  const controller = useCalculationController(counterpartyId, customerName);
  const { calculation, changedIds, entries, lines, totals } = controller;
  const [step, setStep] = useState<Step>('edit');

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
      <FlatList
        contentContainerStyle={styles.lines}
        data={lines}
        keyExtractor={(line) => line.productId.toString()}
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          <TextField
            label="Коментар до замовлення"
            maxLength={1000}
            multiline
            onChangeText={controller.setComment}
            value={calculation.comment ?? ''}
          />
        }
        ListHeaderComponent={queue ?? undefined}
        renderItem={({ item }) => (
          <CalculationLineRow
            changed={changedIds.has(item.productId)}
            line={item}
            onChangeAdjustment={(kopecks) => controller.setAdjustment(item.productId, kopecks)}
            onChangeQuantity={(quantity) => controller.setQuantity(item.productId, quantity)}
            onRemove={() => controller.remove(item.productId)}
          />
        )}
      />
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

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, gap: theme.space.md },
  draft: { alignItems: 'center', flexDirection: 'row', gap: theme.space.sm },
  draftTitle: { flex: 1 },
  lines: { gap: theme.space.sm, paddingBottom: theme.space.lg },
  queue: { gap: theme.space.xs, paddingBottom: theme.space.sm },
}));
