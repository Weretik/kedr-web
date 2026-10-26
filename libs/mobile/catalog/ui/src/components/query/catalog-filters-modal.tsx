import { useKedrTheme } from '@mobile/shared/ui';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Switch, Text } from 'react-native-paper';

import { CatalogActionSheet } from './catalog-action-sheet';
import { CatalogPriceRangeSlider } from './catalog-price-range-slider';

import type { CatalogFilterSelection } from '@mobile/catalog/model';

const MIN_PRICE = 0;
const MAX_PRICE = 20_000;

export interface CatalogFiltersModalProps {
  filters: CatalogFilterSelection;
  onApply: () => void;
  onChange: (filters: CatalogFilterSelection) => void;
  onDismiss: () => void;
  onReset: () => void;
  visible: boolean;
}

export function CatalogFiltersModal({
  filters,
  onApply,
  onChange,
  onDismiss,
  onReset,
  visible,
}: Readonly<CatalogFiltersModalProps>) {
  const { kedr } = useKedrTheme();
  const toggle = (key: 'inStock' | 'isNew' | 'isSale') =>
    onChange({ ...filters, [key]: filters[key] ? undefined : true });
  const changePrice = ([priceFrom, priceTo]: readonly [number, number]) =>
    onChange({
      ...filters,
      priceFrom: priceFrom === MIN_PRICE ? undefined : priceFrom,
      priceTo: priceTo === MAX_PRICE ? undefined : priceTo,
    });

  return (
    <CatalogActionSheet onDismiss={onDismiss} title="Фільтри" visible={visible}>
      <ScrollView contentContainerStyle={styles.content} testID="catalog-filters-scroll">
        <CatalogPriceRangeSlider
          onChange={changePrice}
          priceFrom={filters.priceFrom}
          priceTo={filters.priceTo}
        />
        <FilterSwitch
          label="Лише в наявності"
          onToggle={() => toggle('inStock')}
          value={filters.inStock === true}
        />
        <FilterSwitch
          label="Лише новинки"
          onToggle={() => toggle('isNew')}
          value={filters.isNew === true}
        />
        <FilterSwitch
          label="Лише акції"
          onToggle={() => toggle('isSale')}
          value={filters.isSale === true}
        />
        <View style={styles.actions}>
          <Button
            accessibilityLabel="Скинути фільтри"
            contentStyle={styles.buttonContent}
            onPress={onReset}
            style={styles.button}
            textColor={kedr.colors.onSurface}
          >
            Скинути
          </Button>
          <Button
            accessibilityLabel="Застосувати фільтри"
            buttonColor={kedr.colors.primary}
            contentStyle={styles.buttonContent}
            mode="contained"
            onPress={onApply}
            style={styles.button}
            textColor={kedr.colors.onPrimary}
          >
            Застосувати
          </Button>
        </View>
      </ScrollView>
    </CatalogActionSheet>
  );
}

function FilterSwitch({
  label,
  onToggle,
  value,
}: Readonly<{ label: string; onToggle: () => void; value: boolean }>) {
  const { kedr } = useKedrTheme();
  return (
    <View
      style={[
        styles.switchRow,
        { backgroundColor: kedr.colors.surfaceVariant, borderRadius: kedr.radius.md },
      ]}
    >
      <Text style={styles.switchLabel} variant="bodyMedium">
        {label}
      </Text>
      <Switch
        accessibilityLabel={label}
        color={kedr.colors.primary}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8 },
  button: { borderRadius: 999, flex: 1 },
  buttonContent: { minHeight: 48 },
  content: { gap: 12, padding: 16, paddingBottom: 24 },
  switchLabel: { flex: 1 },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 14,
  },
});
