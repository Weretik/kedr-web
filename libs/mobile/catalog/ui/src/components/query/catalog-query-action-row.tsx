import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';

export function CatalogQueryActionRow({ onOpenCategories, onOpenFilters, onOpenSort }: Readonly<{ onOpenCategories: () => void; onOpenFilters: () => void; onOpenSort: () => void }>) {
  return <View style={styles.row}><IconButton accessibilityLabel="Фільтри" icon="filter-variant" onPress={onOpenFilters} /><IconButton accessibilityLabel="Сортування" icon="sort" onPress={onOpenSort} /><IconButton accessibilityLabel="Категорії" icon="view-list" onPress={onOpenCategories} /></View>;
}

const styles = StyleSheet.create({ row: { flexDirection: 'row', justifyContent: 'flex-end' } });
