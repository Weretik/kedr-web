import { formatKopecks } from '@mobile/shared/model';
import { AppText, Button, createStyles, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

import type { CalculationTotals } from '@mobile/calculation/model';

export interface CalculationFooterProps {
  totals: CalculationTotals;
  onSaveDraft: () => void;
  onSend: () => void;
}

/** «+40,00 ₴», «−40,00 ₴»: the sign is always shown. */
export const formatSignedKopecks = (kopecks: number): string =>
  kopecks > 0 ? `+${formatKopecks(kopecks)}` : formatKopecks(kopecks).replace('-', '−');

/** Adjustment total and total, «Чернетка» and «Відправити в 1С» (R-009–R-011). */
export function CalculationFooter({
  onSaveDraft,
  onSend,
  totals,
}: Readonly<CalculationFooterProps>) {
  const styles = useStyles(stylesSheet);
  const disabled = !totals.isSendable;
  return (
    <View style={styles.footer}>
      <View style={styles.sums}>
        {totals.adjustmentKopecks !== 0 ? (
          <AppText
            numeric
            tone={totals.adjustmentKopecks < 0 ? 'error' : 'success'}
            variant="secondary"
          >
            {`${totals.adjustmentKopecks < 0 ? 'Знижка' : 'Націнка'} ${formatSignedKopecks(totals.adjustmentKopecks)}`}
          </AppText>
        ) : null}
        <AppText numeric variant="total">
          {`Разом ${formatKopecks(totals.totalKopecks)}`}
        </AppText>
        {disabled && totals.lineCount > 0 ? (
          <AppText tone="warning" variant="secondary">
            Виправте позначені рядки
          </AppText>
        ) : null}
      </View>
      <View style={styles.actions}>
        <Button
          disabled={disabled}
          icon="content-save-outline"
          label="Чернетка"
          onPress={onSaveDraft}
          variant="outlined"
        />
        <Button disabled={disabled} icon="send" label="Відправити в 1С" onPress={onSend} />
      </View>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
    justifyContent: 'flex-end',
  },
  footer: {
    borderColor: theme.colors.outlineVariant,
    borderTopWidth: theme.sizes.border,
    gap: theme.space.sm,
    paddingTop: theme.space.md,
  },
  sums: { alignItems: 'flex-end', gap: 2 },
}));
