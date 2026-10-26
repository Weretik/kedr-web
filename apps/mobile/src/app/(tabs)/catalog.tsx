import { CatalogScreen } from '@mobile/catalog/feature';
import { RoundIconButton } from '@mobile/shared/ui';
import { router, Tabs } from 'expo-router';
import { useCallback, useState } from 'react';

export default function CatalogRoute() {
  const [openSearch, setOpenSearch] = useState<(() => void) | undefined>();
  const handleSearchActionChange = useCallback((action: (() => void) | undefined) => {
    setOpenSearch(() => action);
  }, []);

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () =>
            openSearch ? (
              <RoundIconButton
                accessibilityLabel="Пошук товарів"
                icon="magnify"
                onPress={openSearch}
              />
            ) : null,
        }}
      />
      <CatalogScreen
        onProductPress={(product) =>
          router.push({
            pathname: '/product/[productSlug]',
            params: { productSlug: product.productSlug },
          })
        }
        onSearchActionChange={handleSearchActionChange}
      />
    </>
  );
}
