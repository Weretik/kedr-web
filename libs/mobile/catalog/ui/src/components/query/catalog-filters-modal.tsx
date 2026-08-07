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
          <Button accessibilityLabel="Скинути фільтри" onPress={onReset}>
            Скинути
          </Button>
          <Button accessibilityLabel="Застосувати фільтри" mode="contained" onPress={onApply}>
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
  return (
    <View style={styles.switchRow}>
      <Switch accessibilityLabel={label} onValueChange={onToggle} value={value} />
      <Text>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', justifyContent: 'flex-end' },
  content: { gap: 16, padding: 20 },
  switchRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
});
