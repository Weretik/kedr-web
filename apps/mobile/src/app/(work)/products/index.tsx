import { ProductCatalog } from '@mobile/catalog/feature';
import { CustomerBar, useConnectivity, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerSummary } from '@mobile/customers/feature';
import { router } from 'expo-router';

export default function ProductsRoute() {
  const customer = useSelectedCustomerSummary();
  const isOnline = useConnectivity()?.isOnline ?? null;

  return (
    <WorkScreen title="Товари">
      <CustomerBar customer={customer} onChange={() => router.navigate('/customer')} />
      <ProductCatalog
        isOnline={isOnline}
        onOpenProduct={(productId) =>
          router.push({
            params: { productId: productId.toString() },
            pathname: '/products/[productId]',
          })
        }
      />
    </WorkScreen>
  );
}
