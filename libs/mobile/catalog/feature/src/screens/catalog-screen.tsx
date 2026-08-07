import { useEffect } from 'react';

import { CatalogScreenContent } from '../components/catalog-screen-content';
import { useCatalogController } from '../hooks/use-catalog-controller';

export function CatalogScreen({ onSearchActionChange }: Readonly<{ onSearchActionChange?: (action: (() => void) | undefined) => void }>) {
  const controller = useCatalogController();

  useEffect(() => {
    onSearchActionChange?.(() => controller.dispatch({ type: 'searchOpened' }));
    return () => onSearchActionChange?.(undefined);
  }, [controller.dispatch, onSearchActionChange]);

  return <CatalogScreenContent {...controller} />;
}
