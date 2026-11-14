import { formatAdjustment, type PricedLine } from '@mobile/calculation/model';
import { formatKopecks } from '@mobile/shared/model';
import { AppText, createStyles, StatusPill, useStyles } from '@mobile/shared/ui';
import { Pressable, View } from 'react-native';

import { SwipeToRemove } from './swipe-to-remove';

export interface CalculationLineRowProps {
  line: PricedLine;
  /** The server changed this line: it is outlined until the manager sends again (R-012). */
  changed?: boolean;
  /** Opens the line's quantity and price. */
  onOpen: (productId: number) => void;
  onRemove: (productId: number) => void;
}

/** «3 × 2 243,00 грн», or the quantity alone while the line has no price. */
const quantityText = (line: PricedLine): string =>
  line.unitKopecks === null
    ? `${line.quantity} шт`
    : `${line.quantity} × ${formatKopecks(line.unitKopecks)}`;

/**
 * One compact line of the calculation: name, «3 × price», the line amount and a «+56/шт» mark when the price is
 * changed (R-009, SC-011). A tap opens quantity and price; a swipe to the left offers «Прибрати».
 */
export function CalculationLineRow({
  changed = false,
  line,
  onOpen,
  onRemove,
}: Readonly<CalculationLineRowProps>) {
  const styles = useStyles(stylesSheet);
  const name = line.product?.name ?? `Товар ${line.productId}`;
  const adjustment = line.adjustmentKopecks;

  return (
    <SwipeToRemove itemLabel={name} onRemove={() => onRemove(line.productId)}>
      <Pressable
        accessibilityActions={[{ label: 'Прибрати', name: 'remove' }]}
        accessibilityHint="Відкриває кількість і ціну"
        accessibilityLabel={`${name}, ${quantityText(line)}, разом ${formatKopecks(line.lineKopecks)}`}
        accessibilityRole="button"
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'remove') onRemove(line.productId);
        }}
        onPress={() => onOpen(line.productId)}
        style={({ pressed }) => styles.row(changed, pressed)}
      >
        <View style={styles.text}>
          <AppText numberOfLines={2} variant="bodyStrong">
            {name}
          </AppText>
          <AppText numeric tone="secondary" variant="secondary">
            {`Код ${line.productId} · ${quantityText(line)}`}
          </AppText>
          {changed ? <StatusPill kind="warning" label="змінено на сервері" /> : null}
          {line.message ? <StatusPill kind="error" label={line.message} /> : null}
        </View>
        <View style={styles.amount}>
          <AppText numeric variant="price">
            {formatKopecks(line.lineKopecks)}
          </AppText>
          {adjustment !== 0 ? (
            <View style={styles.mark}>
              <AppText numeric variant="caption">
                {`${formatAdjustment(adjustment)}/шт`}
              </AppText>
            </View>
          ) : null}
        </View>
      </Pressable>
    </SwipeToRemove>
  );
}

const stylesSheet = createStyles((theme) => ({
  amount: { alignItems: 'flex-end', gap: theme.space.xs },
  mark: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 1,
  },
  row: (changed: boolean, pressed: boolean) => ({
    alignItems: 'flex-start',
    backgroundColor: pressed ? theme.colors.surfaceMuted : theme.colors.surface,
    borderColor: theme.colors.status.warning.text,
    borderLeftWidth: changed ? 3 : 0,
    flexDirection: 'row',
    gap: theme.space.md,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm + 2,
  }),
  text: { flex: 1, gap: 2 },
}));
