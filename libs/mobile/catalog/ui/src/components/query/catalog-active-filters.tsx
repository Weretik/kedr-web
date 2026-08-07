import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';

import type { CatalogFilterSelection, CatalogSort } from '@mobile/catalog/model';

type ActiveChip = { label: string; onClose: () => void };
type CategoryPathItem = { id: number; label: string };
type CategoryFilter = { label: string; path: readonly CategoryPathItem[] };

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
  category?: CategoryFilter;
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
  const theme = useTheme();
  const selectedCategory =
    category ??
    (categoryLabel
      ? { label: categoryLabel, path: [{ id: -1, label: categoryLabel }] }
      : undefined);
  const chipBackgroundColor = theme.dark ? theme.colors.onSurface : theme.colors.secondary;
  const chipContentColor = theme.dark ? theme.colors.surface : theme.colors.onSecondary;
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
        <CategoryBreadcrumbs category={selectedCategory} onSelectCategory={onSelectCategory} />
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
            <Chip
              closeIcon="close"
              closeIconAccessibilityLabel={`Прибрати: ${label}`}
              compact
              ellipsizeMode="tail"
              key={label}
              mode="flat"
              onClose={onClose}
              selected
              selectedColor={chipContentColor}
              showSelectedCheck={false}
              style={[
                styles.chip,
                {
                  backgroundColor: chipBackgroundColor,
                },
              ]}
              textStyle={[styles.chipText, { color: chipContentColor }]}
            >
              {label}
            </Chip>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

function CategoryBreadcrumbs({
  category,
  onSelectCategory,
}: Readonly<{ category: CategoryFilter; onSelectCategory: (categoryId?: number) => void }>) {
  const theme = useTheme();

  return (
    <ScrollView
      accessibilityLabel="Шлях вибраної категорії"
      contentContainerStyle={styles.breadcrumbs}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <BreadcrumbItem active={false} label="Всі" onPress={() => onSelectCategory(undefined)} />
      {category.path.map((item, index) => (
        <View key={item.id} style={styles.breadcrumbPart}>
          <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
            →
          </Text>
          <BreadcrumbItem
            active={index === category.path.length - 1}
            label={item.label}
            onPress={() => onSelectCategory(item.id)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

function BreadcrumbItem({
  active,
  label,
  onPress,
}: Readonly<{ active: boolean; label: string; onPress: () => void }>) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityLabel={`Вибрати категорію ${label}`}
      accessibilityRole="button"
      onPress={onPress}
      style={
        active ? [styles.activeBreadcrumb, { borderBottomColor: theme.colors.primary }] : undefined
      }
    >
      <Text
        style={{ color: active ? theme.colors.primary : theme.colors.onSurface }}
        variant="labelLarge"
      >
        {label}
      </Text>
    </Pressable>
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
  activeBreadcrumb: { borderBottomWidth: 2 },
  breadcrumbPart: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  breadcrumbs: { alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingTop: 8 },
  chip: { borderRadius: 10, height: 20, maxWidth: 220, minHeight: 0 },
  chipText: {
    fontSize: 12,
    includeFontPadding: false,
    lineHeight: 14,
    marginVertical: 3,
    textAlignVertical: 'center',
  },
  scroll: { flexGrow: 0, flexShrink: 0, height: 28 },
  strip: { alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 4 },
});
