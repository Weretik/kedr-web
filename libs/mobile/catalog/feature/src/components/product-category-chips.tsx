import { createStyles, Chip, useStyles } from '@mobile/shared/ui';
import { ScrollView } from 'react-native';

import type { Category } from '@mobile/catalog/model';

interface ProductCategoryChipsProps {
  categoryId: number | null;
  /** Categories from the root down to the chosen one. */
  path: readonly Category[];
  /** Subcategories of the chosen category, or the top level. */
  children: readonly Category[];
  onSelect: (categoryId: number | null) => void;
}

/** One horizontal row: «Усі категорії», the chosen path, and the next level of subcategories. */
export function ProductCategoryChips({
  categoryId,
  children,
  onSelect,
  path,
}: Readonly<ProductCategoryChipsProps>) {
  const styles = useStyles(stylesSheet);

  return (
    <ScrollView
      contentContainerStyle={styles.chips}
      horizontal
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      style={styles.chipRow}
    >
      <Chip
        icon={categoryId === null ? undefined : 'arrow-left'}
        label={categoryId === null ? 'Усі категорії' : 'Усі'}
        onPress={() => onSelect(null)}
        selected={categoryId === null}
      />
      {path.map((category) => (
        <Chip
          key={category.id}
          label={category.name}
          onPress={() => onSelect(category.id)}
          selected={category.id === categoryId}
        />
      ))}
      {children.map((category) => (
        <Chip key={category.id} label={category.name} onPress={() => onSelect(category.id)} />
      ))}
    </ScrollView>
  );
}

const stylesSheet = createStyles((theme) => ({
  // A horizontal ScrollView grows to fill a column by default; the chip row keeps its own height.
  chipRow: { flexGrow: 0, flexShrink: 0 },
  chips: { alignItems: 'center', gap: theme.space.sm },
}));
