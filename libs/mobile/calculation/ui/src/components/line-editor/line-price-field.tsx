import { formatAdjustment, maxDiscountKopecks, type PricedLine } from '@mobile/calculation/model';
import { AppText, createStyles, SegmentedControl, TextField, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

import { useAdjustmentField } from '../../hooks/use-adjustment-field';

const signs = [
  { label: 'Знижка −', value: 'minus' },
  { label: 'Націнка +', value: 'plus' },
] as const;

interface LinePriceFieldProps {
  line: PricedLine;
  name: string;
  onChangeAdjustment: (kopecks: number) => void;
}

/** «Ціна за штуку»: a discount or markup in hryvnias per piece and the lowest allowed price (SC-012). */
export function LinePriceField({ line, name, onChangeAdjustment }: Readonly<LinePriceFieldProps>) {
  const styles = useStyles(stylesSheet);
  const field = useAdjustmentField(line.adjustmentKopecks, onChangeAdjustment);
  const fieldError = field.typingError ?? (line.problem === 'below-minimum' ? line.message : null);
  const floor = line.baseUnitKopecks === null ? 0 : maxDiscountKopecks(line.baseUnitKopecks);

  return (
    <View style={styles.block}>
      <AppText tone="secondary" variant="caption">
        ЦІНА ЗА ШТУКУ
      </AppText>
      <SegmentedControl
        accessibilityLabel="Знижка чи націнка"
        onChange={field.changeSign}
        segments={signs}
        value={field.sign}
      />
      <TextField
        accessibilityLabel={`Знижка або націнка, гривень за штуку: ${name}`}
        error={fieldError}
        keyboardType="decimal-pad"
        label="Гривень за штуку"
        onChangeText={field.changeText}
        placeholder="0"
        value={field.text}
      />
      {floor < 0 ? (
        <AppText tone="secondary" variant="secondary">
          {`Найбільша знижка ${formatAdjustment(floor)} грн: ціна не нижче 1 грн`}
        </AppText>
      ) : null}
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  block: { gap: theme.space.sm },
}));
