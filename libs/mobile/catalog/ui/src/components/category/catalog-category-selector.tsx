import { FlashList } from '@shopify/flash-list';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';

import type { CatalogCategoryOption } from '@mobile/catalog/model';

export interface CatalogCategorySelectorProps {
  categories: readonly CatalogCategoryOption[];
  onSelect: (categoryId?: number) => void;
  selectedCategoryId?: number;
  style?: StyleProp<ViewStyle>;
}

export function CatalogCategorySelector({
  categories,
  onSelect,
  selectedCategoryId,
  style,
}: Readonly<CatalogCategorySelectorProps>) {
  const theme = useTheme();
  const [path, setPath] = useState<readonly CatalogCategoryOption[]>([]);
  const currentCategories = path.at(-1)?.children ?? categories;
  const selectedPath = useMemo(
    () => findCategoryPath(categories, selectedCategoryId),
    [categories, selectedCategoryId],
  );

  return (
    <View accessibilityLabel="Вибір категорії" style={[styles.container, style]}>
      {selectedPath ? (
        <View
          accessibilityLabel={`Вибрана категорія: ${selectedPath}`}
          style={[styles.selectedPath, { backgroundColor: theme.colors.primaryContainer }]}
        >
          <Text
            numberOfLines={1}
            style={{ color: theme.colors.onPrimaryContainer }}
            variant="labelMedium"
          >
            {selectedPath}
          </Text>
        </View>
      ) : null}
      {path.length ? (
        <View style={styles.backRow}>
          <Pressable
            accessibilityLabel="Повернутися до батьківської категорії"
            onPress={() => setPath(path.slice(0, -1))}
          >
            <Text variant="labelLarge">‹ Назад</Text>
          </Pressable>
        </View>
      ) : null}
      <FlashList
        data={currentCategories}
        keyExtractor={(category) => String(category.id)}
        nestedScrollEnabled
        renderItem={({ item: category }) => (
          <CategoryRow
            category={category}
            isSelected={category.id === selectedCategoryId}
            onOpen={() => setPath([...path, category])}
            onSelect={() => onSelect(category.id)}
          />
        )}
        scrollEnabled
        showsVerticalScrollIndicator
        style={styles.list}
      />
    </View>
  );
}

function findCategoryPath(
  categories: readonly CatalogCategoryOption[],
  categoryId: number | undefined,
  parentPath: readonly string[] = [],
): string | undefined {
  if (categoryId === undefined) return undefined;

  for (const category of categories) {
    const path = [...parentPath, category.label];
    if (category.id === categoryId) return path.join(' → ');
    const childPath = findCategoryPath(category.children, categoryId, path);
    if (childPath) return childPath;
  }

  return undefined;
}

function CategoryRow({
  category,
  isSelected,
  onOpen,
  onSelect,
}: Readonly<{
  category: CatalogCategoryOption;
  isSelected: boolean;
  onOpen: () => void;
  onSelect: () => void;
}>) {
  const theme = useTheme();
  const hasChildren = category.children.length > 0;

  return (
    <View style={[styles.row, { borderBottomColor: theme.colors.outlineVariant }]}>
      <Pressable
        accessibilityLabel={`Категорія ${category.label}`}
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        onPress={onSelect}
        style={styles.selectControl}
      >
        <Text
          style={{ color: isSelected ? theme.colors.primary : theme.colors.onSurface }}
          variant="bodyLarge"
        >
          {category.label}
        </Text>
      </Pressable>
      {hasChildren ? (
        <IconButton
          accessibilityLabel={`Відкрити підкатегорії ${category.label}`}
          icon="chevron-right"
          iconColor={theme.colors.primary}
          onPress={onOpen}
        />
      ) : (
        <View style={styles.trailingSpace} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backRow: { justifyContent: 'center', minHeight: 40, paddingHorizontal: 8 },
  list: { flex: 1 },
  row: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 58,
  },
  selectControl: { flex: 1, justifyContent: 'center', minHeight: 58, paddingLeft: 8 },
  selectedPath: { marginBottom: 4, marginHorizontal: 8, paddingHorizontal: 12, paddingVertical: 8 },
  trailingSpace: { width: 48 },
});
