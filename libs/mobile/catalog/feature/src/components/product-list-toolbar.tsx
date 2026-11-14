import { nextProductSort, productSortLabels, type ProductSort } from '@mobile/catalog/model';
import { createStyles, IconButton, SearchField, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

interface ProductListToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
}

/** Search by name or code with the «Лише в наявності» and sort toggle buttons. */
export function ProductListToolbar({
  inStockOnly,
  onQueryChange,
  onSortChange,
  onToggleInStock,
  query,
  sort,
}: Readonly<ProductListToolbarProps>) {
  const styles = useStyles(stylesSheet);

  return (
    <View style={styles.toolbar}>
      <View style={styles.search}>
        <SearchField
          accessibilityLabel="Пошук товару"
          onChangeText={onQueryChange}
          placeholder="Назва або код"
          value={query}
        />
      </View>
      <IconButton
        accessibilityLabel="Лише в наявності"
        icon="package-variant-closed-check"
        onPress={onToggleInStock}
        selected={inStockOnly}
        variant="outlined"
      />
      <IconButton
        accessibilityLabel={`Сортування: ${productSortLabels[sort]}`}
        icon="sort"
        onPress={() => onSortChange(nextProductSort(sort))}
        selected={sort !== 'name'}
        variant="outlined"
      />
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  search: { flex: 1 },
  toolbar: { alignItems: 'center', flexDirection: 'row', gap: theme.space.sm },
}));
