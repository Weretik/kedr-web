import { HeroHeader, SearchField, useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';

import { CatalogQueryControls, countActiveFilters } from './catalog-query-controls';
import { CatalogResults } from './catalog-results';

import type { useCatalogController } from '../hooks/use-catalog-controller';
import type { CatalogProduct } from '@mobile/catalog/model';

type CatalogController = ReturnType<typeof useCatalogController> & {
  onProductPress: (product: CatalogProduct) => void;
};

export function CatalogScreenContent(controller: Readonly<CatalogController>) {
  const theme = useKedrTheme();
  const { dispatch, state } = controller;
  const activeFilters = countActiveFilters(state.query.filters);

  return (
    <View
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
      testID="catalog-screen"
    >
      <HeroHeader eyebrow="Каталог" title="Що шукаємо?">
        <SearchField
          accessibilityLabel="Відкрити пошук товарів"
          onPress={() => dispatch({ type: 'searchOpened' })}
          onTrailingPress={() => dispatch({ type: 'filtersOpened' })}
          placeholder={state.query.search || 'Назва або артикул'}
          trailingBadge={activeFilters}
          trailingIcon="tune-variant"
          trailingLabel="Відкрити фільтри"
        />
      </HeroHeader>
      <CatalogQueryControls {...controller} />
      <CatalogResults {...controller} />
    </View>
  );
}

const styles = StyleSheet.create({ screen: { flex: 1 } });
