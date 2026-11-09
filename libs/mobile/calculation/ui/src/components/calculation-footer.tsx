import { positionsLabel, type CalculationTotals } from '@mobile/calculation/model';
import { formatKopecks } from '@mobile/shared/model';
import { AppText, Button, createStyles, IconButton, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

export interface CalculationFooterProps {
  totals: CalculationTotals;
  onSaveDraft: () => void;
  onSend: () => void;
}

/** «+40,00 грн», «−40,00 грн»: the sign is always shown. */
export const formatSignedKopecks = (kopecks: number): string =>
  kopecks > 0 ? `+${formatKopecks(kopecks)}` : formatKopecks(kopecks).replace('-', '−');

/**
 * Stays under the list: «2 позиції · 4 шт · знижка −40,00 грн», the total, a small «Чернетка» and the main
 * «Відправити в 1С» (R-009–R-011).
 */
export function CalculationFooter({
  onSaveDraft,
  onSend,
  totals,
}: Readonly<CalculationFooterProps>) {
  const styles = useStyles(stylesSheet);
  const disabled = !totals.isSendable;
  const adjustment =
    totals.adjustmentKopecks === 0
      ? null
      : `${totals.adjustmentKopecks < 0 ? 'знижка' : 'націнка'} ${formatSignedKopecks(totals.adjustmentKopecks)}`;

  return (
    <View style={styles.footer}>
      <View style={styles.sums}>
        <AppText numeric style={styles.summary} tone="secondary" variant="secondary">
          {[positionsLabel(totals.lineCount), `${totals.unitCount} шт`, adjustment]
            .filter(Boolean)
            .join(' · ')}
        </AppText>
        <AppText
          accessibilityLabel={`Разом ${formatKopecks(totals.totalKopecks)}`}
          numeric
          variant="total"
        >
          {formatKopecks(totals.totalKopecks)}
        </AppText>
      </View>
      {disabled && totals.lineCount > 0 ? (
        <AppText tone="warning" variant="secondary">
          Виправте позначені рядки
        </AppText>
      ) : null}
      <View style={styles.actions}>
        <IconButton
          accessibilityLabel="Чернетка"
          disabled={disabled}
          icon="content-save-outline"
          onPress={onSaveDraft}
          variant="outlined"
        />
        <View style={styles.send}>
          <Button disabled={disabled} icon="send" label="Відправити в 1С" onPress={onSend} />
        </View>
      </View>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  actions: { alignItems: 'center', flexDirection: 'row', gap: theme.space.sm },
  footer: {
    borderColor: theme.colors.outlineVariant,
    borderTopWidth: theme.sizes.border,
    gap: theme.space.sm,
    paddingBottom: theme.space.sm,
    paddingTop: theme.space.sm,
  },
  send: { flex: 1 },
  summary: { flex: 1 },
  sums: { alignItems: 'baseline', flexDirection: 'row', gap: theme.space.md },
}));
