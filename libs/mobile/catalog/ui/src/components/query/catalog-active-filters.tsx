import { FilterChip } from '@mobile/shared/ui';
import { ScrollView, StyleSheet, View } from 'react-native';

import {
  CatalogCategoryBreadcrumbs,
  type CatalogCategoryFilter,
} from '../category/catalog-category-breadcrumbs';

import type { CatalogFilterSelection, CatalogSort } from '@mobile/catalog/model';

type ActiveChip = { label: string; onClose: () => void };

export function CatalogActiveFilters({
  category,
  categoryLabel,
  filters,
  onSelectCategory,
  onRemoveFilter,
  onRemovePriceRange,
  onRemoveSearch,
  onResetSort,
  search,
  sort,
}: Readonly<{
  category?: CatalogCategoryFilter;
  categoryLabel?: string;
  filters: CatalogFilterSelection;
  onSelectCategory: (categoryId?: number) => void;
  onRemoveFilter: (field: 'inStock' | 'isNew' | 'isSale') => void;
  onRemovePriceRange: () => void;
  onRemoveSearch: () => void;
  onResetSort: () => void;
  search: string;
  sort: CatalogSort;
}>) {
  const selectedCategory =
    category ??
    (categoryLabel
      ? { label: categoryLabel, path: [{ id: -1, label: categoryLabel }] }
      : undefined);
  const chips: readonly (ActiveChip | null)[] = [
    search ? { label: `Пошук: ${search}`, onClose: onRemoveSearch } : null,
    filters.inStock ? { label: 'В наявності', onClose: () => onRemoveFilter('inStock') } : null,
    filters.isNew ? { label: 'Новинки', onClose: () => onRemoveFilter('isNew') } : null,
    filters.isSale ? { label: 'Акції', onClose: () => onRemoveFilter('isSale') } : null,
    filters.priceFrom === undefined && filters.priceTo === undefined
      ? null
      : {
          label: `Ціна: ${filters.priceFrom ?? 0}–${filters.priceTo ?? '…'}`,
          onClose: onRemovePriceRange,
        },
    sort === 'IdAsc' ? null : { label: sortLabel(sort), onClose: onResetSort },
  ];

  const activeChips = chips.filter((chip): chip is ActiveChip => chip !== null);
  if (!selectedCategory && !activeChips.length) return null;

  return (
    <View>
      {selectedCategory ? (
        <CatalogCategoryBreadcrumbs
          category={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      ) : null}
      {activeChips.length ? (
        <ScrollView
          accessibilityLabel="Активні фільтри"
          alwaysBounceVertical={false}
          contentContainerStyle={styles.strip}
          horizontal
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          style={styles.scroll}
        >
          {activeChips.map(({ label, onClose }) => (
            <FilterChip
              accessibilityLabel={`Прибрати: ${label}`}
              key={label}
              label={label}
              onPress={onClose}
              removable
              selected
            />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

function sortLabel(sort: CatalogSort) {
  const labels: Record<CatalogSort, string> = {
    IdAsc: 'ID — за зростанням',
    IdDesc: 'ID — за спаданням',
    NameAsc: 'Назва — за зростанням',
    NameDesc: 'Назва — за спаданням',
    PriceAsc: 'Ціна — за зростанням',
    PriceDesc: 'Ціна — за спаданням',
  };
  return labels[sort];
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, flexShrink: 0 },
  strip: { alignItems: 'center', gap: 8, paddingBottom: 8, paddingHorizontal: 16 },
});
