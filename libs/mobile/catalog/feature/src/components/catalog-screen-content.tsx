import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { CatalogQueryControls } from './catalog-query-controls';
import { CatalogResults } from './catalog-results';

import type { useCatalogController } from '../hooks/use-catalog-controller';
import type { CatalogProduct } from '@mobile/catalog/model';

type CatalogController = ReturnType<typeof useCatalogController> & {
  onProductPress: (product: CatalogProduct) => void;
};

export function CatalogScreenContent(controller: Readonly<CatalogController>) {
  const theme = useTheme();

  return (
    <View
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
      testID="catalog-screen"
    >
      <CatalogQueryControls {...controller} />
      <CatalogResults {...controller} />
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
