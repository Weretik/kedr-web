import {
  formatAdjustment,
  maxDiscountKopecks,
  parseAdjustment,
  type PricedLine,
} from '@mobile/calculation/model';
import { formatKopecks } from '@mobile/shared/model';
import {
  AppText,
  Button,
  createStyles,
  QuantityStepper,
  SegmentedControl,
  TextField,
  useStyles,
} from '@mobile/shared/ui';
import { useState } from 'react';
import { View } from 'react-native';

export interface LineEditorProps {
  line: PricedLine;
  onChangeAdjustment: (kopecks: number) => void;
  onChangeQuantity: (quantity: number) => void;
  onDone: () => void;
  onRemove: () => void;
}

type Sign = 'minus' | 'plus';

const signs = [
  { label: 'Знижка −', value: 'minus' },
  { label: 'Націнка +', value: 'plus' },
] as const;

/** «56» for both +56 and −56: the sign lives in the switch above the field. */
const amountText = (kopecks: number) => (kopecks === 0 ? '' : formatAdjustment(kopecks).slice(1));

/**
 * Quantity and the price per piece of one calculation line: a discount or markup in hryvnias per piece, the lowest
 * allowed price, the line amount and «Прибрати з розрахунку» (R-009, SC-011, SC-012).
 */
export function LineEditor({
  line,
  onChangeAdjustment,
  onChangeQuantity,
  onDone,
  onRemove,
}: Readonly<LineEditorProps>) {
  const styles = useStyles(stylesSheet);
  const [sign, setSign] = useState<Sign>(line.adjustmentKopecks < 0 ? 'minus' : 'plus');
  const [text, setText] = useState(() => amountText(line.adjustmentKopecks));
  const [typingError, setTypingError] = useState<string | null>(null);
  const name = line.product?.name ?? `Товар ${line.productId}`;
  const stock = line.product ? Math.max(1, Math.floor(line.product.stock)) : line.quantity;

  const apply = (nextSign: Sign, nextText: string) => {
    const parsed = parseAdjustment(
      `${nextSign === 'minus' ? '-' : ''}${nextText.replace(/^[+−-]/, '')}`,
    );
    if (parsed.kind === 'invalid') {
      setTypingError(parsed.message);
      return;
    }
    setTypingError(null);
    if (parsed.kopecks !== line.adjustmentKopecks) onChangeAdjustment(parsed.kopecks);
  };

  const fieldError = typingError ?? (line.problem === 'below-minimum' ? line.message : null);
  const lineProblem = line.problem && line.problem !== 'below-minimum' ? line.message : null;
  const floor = line.baseUnitKopecks === null ? 0 : maxDiscountKopecks(line.baseUnitKopecks);

  return (
    <View style={styles.editor}>
      <View style={styles.head}>
        <AppText accessibilityRole="header" variant="sectionTitle">
          {name}
        </AppText>
        <AppText numeric tone="secondary" variant="secondary">
          {[
            `Код ${line.productId}`,
            line.product ? `на складі ${stock}` : null,
            `базова ціна ${formatKopecks(line.baseUnitKopecks)}`,
          ]
            .filter(Boolean)
            .join(' · ')}
        </AppText>
        {lineProblem ? (
          <AppText tone="error" variant="secondary">
            {lineProblem}
          </AppText>
        ) : null}
      </View>

      <View style={styles.block}>
        <AppText tone="secondary" variant="caption">
          КІЛЬКІСТЬ
        </AppText>
        <QuantityStepper
          itemLabel={name}
          max={stock}
          min={1}
          onChange={onChangeQuantity}
          value={line.quantity}
        />
      </View>

      <View style={styles.block}>
        <AppText tone="secondary" variant="caption">
          ЦІНА ЗА ШТУКУ
        </AppText>
        <SegmentedControl
          accessibilityLabel="Знижка чи націнка"
          onChange={(value) => {
            setSign(value);
            apply(value, text);
          }}
          segments={signs}
          value={sign}
        />
        <TextField
          accessibilityLabel={`Знижка або націнка, гривень за штуку: ${name}`}
          error={fieldError}
          keyboardType="decimal-pad"
          label="Гривень за штуку"
          onChangeText={(value) => {
            setText(value);
            apply(sign, value);
          }}
          placeholder="0"
          value={text}
        />
        {floor < 0 ? (
          <AppText tone="secondary" variant="secondary">
            {`Найбільша знижка ${formatAdjustment(floor)} грн: ціна не нижче 1 грн`}
          </AppText>
        ) : null}
      </View>

      <View style={styles.total}>
        <AppText numeric tone="secondary" variant="secondary">
          {line.unitKopecks === null
            ? 'Ціну уточнюйте'
            : `${formatKopecks(line.unitKopecks)} × ${line.quantity}`}
        </AppText>
        <AppText numeric variant="total">
          {formatKopecks(line.lineKopecks)}
        </AppText>
      </View>

      <Button label="Готово" onPress={onDone} />
      <Button label="Прибрати з розрахунку" onPress={onRemove} variant="text" />
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  block: { gap: theme.space.sm },
  editor: { gap: theme.space.lg, padding: theme.space.lg },
  head: { gap: theme.space.xs },
  total: {
    alignItems: 'baseline',
    borderColor: theme.colors.outlineVariant,
    borderTopWidth: theme.sizes.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: theme.space.md,
  },
}));
