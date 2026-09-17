import { CatalogScreen } from '@mobile/catalog/feature';
import { ThemePreferenceHeaderControl } from '@mobile/core/shell';
import { router, Tabs } from 'expo-router';
import { useCallback, useState } from 'react';
import { Appbar } from 'react-native-paper';

export default function CatalogRoute() {
  const [openSearch, setOpenSearch] = useState<(() => void) | undefined>();
  const handleSearchActionChange = useCallback((action: (() => void) | undefined) => {
    setOpenSearch(() => action);
  }, []);

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => (
            <>
              <ThemePreferenceHeaderControl />
              {openSearch ? (
                <Appbar.Action
                  accessibilityLabel="Пошук товарів"
                  icon="magnify"
                  onPress={openSearch}
                />
              ) : null}
            </>
          ),
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
