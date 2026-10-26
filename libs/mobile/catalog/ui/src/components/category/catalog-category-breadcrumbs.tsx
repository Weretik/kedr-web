import { useKedrTheme } from '@mobile/shared/ui';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import type { CatalogCategoryPathItem } from '@mobile/catalog/model';

export interface CatalogCategoryFilter {
  label: string;
  path: readonly CatalogCategoryPathItem[];
}

/** "Всі → parent → selected" path; each part selects that category. */
export function CatalogCategoryBreadcrumbs({
  category,
  onSelectCategory,
}: Readonly<{ category: CatalogCategoryFilter; onSelectCategory: (categoryId?: number) => void }>) {
  const theme = useKedrTheme();

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
  const theme = useKedrTheme();
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

const styles = StyleSheet.create({
  activeBreadcrumb: { borderBottomWidth: 2 },
  breadcrumbPart: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  breadcrumbs: { alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingTop: 8 },
});
