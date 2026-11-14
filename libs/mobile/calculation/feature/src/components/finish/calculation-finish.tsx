import { CalculationFooter } from '@mobile/calculation/ui';
import { formatDate } from '@mobile/shared/model';
import { useState } from 'react';

import { ConfirmSend, SaveDraftForm } from './finish-step';

import type { CalculationTotals } from '@mobile/calculation/model';

interface CalculationFinishProps {
  customerName: string;
  isOnline: boolean | null;
  totals: CalculationTotals;
  /** The title of the draft this calculation was opened from, if any. */
  draftTitle: string | undefined;
  onSend: () => void;
  onSaveDraft: (title: string) => void;
}

/** Under the lines: the total with «Чернетка» and «Відправити в 1С», then the confirmation or the draft title. */
export function CalculationFinish({
  customerName,
  draftTitle,
  isOnline,
  onSaveDraft,
  onSend,
  totals,
}: Readonly<CalculationFinishProps>) {
  const [step, setStep] = useState<'confirm' | 'draft' | 'edit'>('edit');
  const back = () => setStep('edit');

  if (step === 'confirm') {
    return (
      <ConfirmSend
        customerName={customerName}
        isOnline={isOnline}
        lineCount={totals.lineCount}
        onCancel={back}
        onConfirm={() => {
          onSend();
          back();
        }}
        totalKopecks={totals.totalKopecks}
      />
    );
  }
  if (step === 'draft') {
    return (
      <SaveDraftForm
        initialTitle={draftTitle || `${customerName}, ${formatDate(new Date().toISOString())}`}
        onCancel={back}
        onSave={(title) => {
          onSaveDraft(title);
          back();
        }}
      />
    );
  }
  return (
    <CalculationFooter
      onSaveDraft={() => setStep('draft')}
      onSend={() => setStep('confirm')}
      totals={totals}
    />
  );
}
