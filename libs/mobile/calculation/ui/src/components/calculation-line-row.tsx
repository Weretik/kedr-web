import { formatAdjustment, parseAdjustment, type PricedLine } from '@mobile/calculation/model';
import { formatKopecks } from '@mobile/shared/model';
import {
  AppText,
  Card,
  createStyles,
  IconButton,
  QuantityStepper,
  StatusPill,
  TextField,
  useStyles,
} from '@mobile/shared/ui';
import { useState } from 'react';
import { View } from 'react-native';

export interface CalculationLineRowProps {
  line: PricedLine;
  /** The server changed this line: it is outlined until the manager sends again (R-012). */
  changed?: boolean;
  onChangeAdjustment: (kopecks: number) => void;
  onChangeQuantity: (quantity: number) => void;
  onRemove: () => void;
}

const fieldText = (kopecks: number) => (kopecks === 0 ? '' : formatAdjustment(kopecks));

/**
 * Name, price, quantity and «± ₴/шт»: minus is a discount in red, plus or a bare number is a markup in green
 * (R-009, SC-011, SC-012). Key it by product so the field keeps what the manager typed.
 */
export function CalculationLineRow({
  changed = false,
  line,
  onChangeAdjustment,
  onChangeQuantity,
  onRemove,
}: Readonly<CalculationLineRowProps>) {
  const styles = useStyles(stylesSheet);
  const [text, setText] = useState(() => fieldText(line.adjustmentKopecks));
  const [typingError, setTypingError] = useState<string | null>(null);
  const name = line.product?.name ?? `Товар ${line.productId}`;
  const stock = line.product ? Math.max(1, Math.floor(line.product.stock)) : line.quantity;

  const changeText = (value: string) => {
    setText(value);
    const parsed = parseAdjustment(value);
    if (parsed.kind === 'invalid') {
      setTypingError(parsed.message);
      return;
    }
    setTypingError(null);
    if (parsed.kopecks !== line.adjustmentKopecks) onChangeAdjustment(parsed.kopecks);
  };

  const fieldError = typingError ?? (line.problem === 'below-minimum' ? line.message : null);
  const lineProblem = line.problem && line.problem !== 'below-minimum' ? line.message : null;
  const adjustment = line.adjustmentKopecks;

  return (
    <Card style={styles.card(changed)}>
      <View style={styles.head}>
        <View style={styles.title}>
          <AppText numberOfLines={2} variant="bodyStrong">
            {name}
          </AppText>
          <AppText numeric tone="secondary" variant="secondary">
            {`Код ${line.productId} · ${formatKopecks(line.baseUnitKopecks)}`}
            {adjustment !== 0 && line.unitKopecks !== null
              ? ` → ${formatKopecks(line.unitKopecks)}`
              : ''}
          </AppText>
          {changed ? <StatusPill kind="warning" label="змінено на сервері" /> : null}
          {lineProblem ? <StatusPill kind="error" label={lineProblem} /> : null}
        </View>
        <IconButton
          accessibilityLabel={`Прибрати ${name}`}
          icon="close"
          onPress={onRemove}
          variant="plain"
        />
      </View>
      <View style={styles.controls}>
        <QuantityStepper
          itemLabel={name}
          max={stock}
          min={1}
          onChange={onChangeQuantity}
          value={line.quantity}
        />
        <View style={styles.adjustment}>
          <TextField
            accessibilityLabel={`Знижка або націнка, гривень за штуку: ${name}`}
            error={fieldError}
            keyboardType="numbers-and-punctuation"
            label="± ₴/шт"
            onChangeText={changeText}
            placeholder="0"
            value={text}
          />
        </View>
        <View style={styles.amount}>
          {adjustment !== 0 ? (
            <AppText numeric tone={adjustment < 0 ? 'error' : 'success'} variant="secondary">
              {`${formatAdjustment(adjustment)} ₴/шт`}
            </AppText>
          ) : null}
          <AppText numeric variant="price">
            {formatKopecks(line.lineKopecks)}
          </AppText>
        </View>
      </View>
    </Card>
  );
}

const stylesSheet = createStyles((theme) => ({
  adjustment: { minWidth: 120, flexGrow: 1, maxWidth: 180 },
  amount: { alignItems: 'flex-end', flexGrow: 1, gap: 2 },
  card: (changed: boolean) => ({
    borderColor: changed ? theme.colors.status.warning.text : theme.colors.outlineVariant,
    borderWidth: changed ? 2 : theme.sizes.border,
    gap: theme.space.md,
    padding: theme.space.md,
  }),
  controls: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.md },
  head: { alignItems: 'flex-start', flexDirection: 'row', gap: theme.space.sm },
  title: { flex: 1, gap: 2 },
}));
