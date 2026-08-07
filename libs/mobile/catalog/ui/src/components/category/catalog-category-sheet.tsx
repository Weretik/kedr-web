import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { Button, IconButton, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CatalogCategorySelector } from './catalog-category-selector';

import type { CatalogCategoryOption } from '@mobile/catalog/model';

export function CatalogCategorySheet({
  categories,
  isError,
  isLoading,
  onApply,
  onChange,
  onDismiss,
  onRetry,
  selectedCategoryId,
  visible,
}: Readonly<{
  categories: readonly CatalogCategoryOption[];
  isError: boolean;
  isLoading: boolean;
  onApply: () => void;
  onChange: (id?: number) => void;
  onDismiss: () => void;
  onRetry: () => void;
  selectedCategoryId?: number;
  visible: boolean;
}>) {
  const theme = useTheme();

  return (
    <Modal animationType="slide" onRequestClose={onDismiss} visible={visible}>
      <SafeAreaView
        edges={['top', 'right', 'bottom', 'left']}
        style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.header}>
          <IconButton
            accessibilityLabel="Закрити вибір категорії"
            icon="arrow-left"
            onPress={onDismiss}
          />
          <Text style={styles.title} variant="titleLarge">
            Виберіть категорію
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.content} testID="catalog-category-sheet">
          <CategoryContent
            categories={categories}
            isError={isError}
            isLoading={isLoading}
            onChange={onChange}
            onRetry={onRetry}
            selectedCategoryId={selectedCategoryId}
          />
          <Button accessibilityLabel="Застосувати категорію" mode="contained" onPress={onApply}>
            Застосувати
          </Button>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function CategoryContent({
  categories,
  isError,
  isLoading,
  onChange,
  onRetry,
  selectedCategoryId,
}: Readonly<{
  categories: readonly CatalogCategoryOption[];
  isError: boolean;
  isLoading: boolean;
  onChange: (id?: number) => void;
  onRetry: () => void;
  selectedCategoryId?: number;
}>) {
  if (isLoading)
    return (
      <View accessibilityLabel="Завантаження категорій" style={styles.state}>
        <ActivityIndicator />
        <Text>Завантажуємо категорії…</Text>
      </View>
    );
  if (isError)
    return (
      <View accessibilityRole="alert" style={styles.state}>
        <Text>Не вдалося завантажити категорії.</Text>
        <Button accessibilityLabel="Повторити завантаження категорій" onPress={onRetry}>
          Повторити
        </Button>
      </View>
    );
  if (!categories.length)
    return (
      <View style={styles.state}>
        <Text accessibilityLabel="Категорії відсутні">Категорії поки що відсутні.</Text>
      </View>
    );
  return (
    <CatalogCategorySelector
      categories={categories}
      onSelect={onChange}
      selectedCategoryId={selectedCategoryId}
    />
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, gap: 16, padding: 20 },
  header: { alignItems: 'center', flexDirection: 'row', minHeight: 56, paddingHorizontal: 4 },
  headerSpacer: { width: 48 },
  safeArea: { flex: 1 },
  state: { alignItems: 'center', flex: 1, gap: 12, justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center' },
});
