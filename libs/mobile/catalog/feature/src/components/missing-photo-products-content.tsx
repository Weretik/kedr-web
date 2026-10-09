import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import { MissingPhotoProductsResults } from './missing-photo-products-results';

import type { useMissingPhotoProductsController } from '../hooks/use-missing-photo-products-controller';
import type { CatalogProduct } from '@mobile/catalog/model';

export type MissingPhotoProductsController = ReturnType<
  typeof useMissingPhotoProductsController
> & {
  onProductPress: (product: CatalogProduct) => void;
};

export function MissingPhotoProductsContent(controller: Readonly<MissingPhotoProductsController>) {
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <Text accessibilityRole="header" style={styles.heading} variant="titleLarge">
        Товари без фотографій
      </Text>
      <MissingPhotoProductsResults {...controller} />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { paddingHorizontal: 16, paddingTop: 16 },
  screen: { flex: 1 },
});
