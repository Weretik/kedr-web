import { CalculationPanel, useAddToCalculation } from '@mobile/calculation/feature';
import { ProductCatalog } from '@mobile/catalog/feature';
import { CustomerBar, useConnectivity, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerSummary } from '@mobile/customers/feature';
import { router } from 'expo-router';

export default function ProductsRoute() {
  const customer = useSelectedCustomerSummary();
  const isOnline = useConnectivity()?.isOnline ?? null;
  const addToCalculation = useAddToCalculation();

  return (
    <WorkScreen
      subheader={<CustomerBar customer={customer} onChange={() => router.navigate('/customer')} />}
      title="Товари"
    >
      <ProductCatalog
        isOnline={isOnline}
        onAdd={addToCalculation}
        onOpenProduct={(productId) =>
          router.push({
            params: { productId: productId.toString() },
            pathname: '/products/[productId]',
          })
        }
        sidePanel={<CalculationPanel isOnline={isOnline} />}
      />
    </WorkScreen>
  );
}
