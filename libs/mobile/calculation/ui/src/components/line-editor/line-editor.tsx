import { type PricedLine } from '@mobile/calculation/model';
import { formatKopecks } from '@mobile/shared/model';
import { AppText, Button, createStyles, QuantityStepper, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

import { LinePriceField } from './line-price-field';

export interface LineEditorProps {
  line: PricedLine;
  onChangeAdjustment: (kopecks: number) => void;
  onChangeQuantity: (quantity: number) => void;
  onDone: () => void;
  onRemove: () => void;
}

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
  const name = line.product?.name ?? `Товар ${line.productId}`;
  const stock = line.product ? Math.max(1, Math.floor(line.product.stock)) : line.quantity;

  const lineProblem = line.problem && line.problem !== 'below-minimum' ? line.message : null;

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

      <LinePriceField line={line} name={name} onChangeAdjustment={onChangeAdjustment} />

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
