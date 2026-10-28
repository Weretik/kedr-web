import { MissingPhotoProductsScreen } from '@mobile/catalog/feature';
import { AccountHeaderControl } from '@mobile/core/auth';
import { ThemePreferenceHeaderControl } from '@mobile/core/shell';
import { router, Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

export default function ProfileRoute() {
  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => (
            <View style={styles.headerActions}>
              <ThemePreferenceHeaderControl />
              <AccountHeaderControl />
            </View>
          ),
        }}
      />
      <MissingPhotoProductsScreen
        onProductPress={(product) =>
          router.push({
            pathname: '/product/[productSlug]',
            params: { productSlug: product.productSlug },
          })
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerActions: { flexDirection: 'row', gap: 8 },
});
