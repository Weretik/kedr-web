import { FilterChip } from '@mobile/shared/ui';
import { ScrollView, StyleSheet } from 'react-native';

export interface CatalogQueryActionRowProps {
  activeFilterCount?: number;
  categoryLabel?: string;
  onOpenCategories: () => void;
  onOpenFilters: () => void;
  onOpenSort: () => void;
  sortLabel?: string;
}

/** Labeled entry points for categories, filters, and sort; each shows when it is in effect. */
export function CatalogQueryActionRow({
  activeFilterCount = 0,
  categoryLabel,
  onOpenCategories,
  onOpenFilters,
  onOpenSort,
  sortLabel,
}: Readonly<CatalogQueryActionRowProps>) {
  return (
    <ScrollView
      contentContainerStyle={styles.row}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <FilterChip
        accessibilityLabel="Категорії"
        icon="shape-outline"
        label={categoryLabel ?? 'Категорії'}
        onPress={onOpenCategories}
        selected={categoryLabel !== undefined}
      />
      <FilterChip
        accessibilityLabel="Фільтри"
        icon="tune-variant"
        label={activeFilterCount ? `Фільтри · ${activeFilterCount}` : 'Фільтри'}
        onPress={onOpenFilters}
        selected={activeFilterCount > 0}
      />
      <FilterChip
        accessibilityLabel="Сортування"
        icon="sort"
        label={sortLabel ?? 'Сортування'}
        onPress={onOpenSort}
        selected={sortLabel !== undefined}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({ row: { gap: 8, paddingHorizontal: 16, paddingVertical: 12 } });
