import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button, Divider, RadioButton, Text, useTheme } from 'react-native-paper';

import { CatalogActionSheet } from './catalog-action-sheet';

import type { CatalogSort } from '@mobile/catalog/model';

const options: readonly { direction: string; label: string; value: CatalogSort }[] = [
  { direction: 'за зростанням', label: 'ID', value: 'IdAsc' },
  { direction: 'за спаданням', label: 'ID', value: 'IdDesc' },
  { direction: 'за зростанням', label: 'Назва', value: 'NameAsc' },
  { direction: 'за спаданням', label: 'Назва', value: 'NameDesc' },
  { direction: 'за зростанням', label: 'Ціна', value: 'PriceAsc' },
  { direction: 'за спаданням', label: 'Ціна', value: 'PriceDesc' },
];

export function CatalogSortMenu({
  onDismiss,
  onSelect,
  sort,
  visible,
}: Readonly<{
  onDismiss: () => void;
  onSelect: (sort: CatalogSort) => void;
  sort: CatalogSort;
  visible: boolean;
}>) {
  const [draftSort, setDraftSort] = useState<CatalogSort>(sort);
  const theme = useTheme();

  useEffect(() => {
    if (visible) setDraftSort(sort);
  }, [sort, visible]);

  return (
    <CatalogActionSheet onDismiss={onDismiss} title="Сортування" visible={visible}>
      <View style={styles.content}>
        <View style={[styles.options, { backgroundColor: theme.colors.surfaceVariant }]}>
          {options.map(({ direction, label, value }, index) => {
            const text = `${label} — ${direction}`;
            const isSelected = draftSort === value;

            return (
              <View key={value}>
                {index > 0 ? <Divider style={styles.divider} /> : null}
                <Pressable
                  accessibilityLabel={`Сортування: ${text}`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  onPress={() => setDraftSort(value)}
                  style={styles.option}
                >
                  <Text
                    style={[styles.optionLabel, { color: theme.colors.onSurface }]}
                    variant="bodyLarge"
                  >
                    {text}
                  </Text>
                  <RadioButton.Android
                    color={theme.colors.primary}
                    status={isSelected ? 'checked' : 'unchecked'}
                    value={value}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>

        <Button
          buttonColor={theme.colors.primary}
          contentStyle={styles.saveButtonContent}
          mode="contained"
          onPress={() => onSelect(draftSort)}
          style={styles.saveButton}
          textColor={theme.colors.onPrimary}
        >
          Зберегти
        </Button>
      </View>
    </CatalogActionSheet>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  divider: { marginLeft: 20 },
  option: { alignItems: 'center', flexDirection: 'row', minHeight: 58, paddingHorizontal: 20 },
  optionLabel: { flex: 1 },
  options: { borderRadius: 12, overflow: 'hidden' },
  saveButton: { marginTop: 16 },
  saveButtonContent: { minHeight: 44 },
});
