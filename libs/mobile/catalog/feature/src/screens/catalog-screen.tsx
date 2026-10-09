import { useEffect } from 'react';

import { CatalogScreenContent } from '../components/catalog-screen-content';
import { useCatalogController } from '../hooks/use-catalog-controller';

import type { CatalogProduct } from '@mobile/catalog/model';

export interface CatalogScreenProps {
  onProductPress: (product: CatalogProduct) => void;
  onSearchActionChange?: (action: (() => void) | undefined) => void;
}

export function CatalogScreen({
  onProductPress,
  onSearchActionChange,
}: Readonly<CatalogScreenProps>) {
  const controller = useCatalogController();
  const { dispatch } = controller;

  useEffect(() => {
    onSearchActionChange?.(() => dispatch({ type: 'searchOpened' }));
    return () => onSearchActionChange?.(undefined);
  }, [dispatch, onSearchActionChange]);

  return <CatalogScreenContent {...controller} onProductPress={onProductPress} />;
}
