import { CalculationLineSheet } from '@mobile/calculation/feature';
import { router, useLocalSearchParams } from 'expo-router';

/** Quantity and price of one calculation line, as a sheet over the products and the calculation next to them (tablet). */
export default function CalculationLineRoute() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  return (
    <CalculationLineSheet
      onClose={() => (router.canGoBack() ? router.back() : router.replace('/products'))}
      productId={Number(productId)}
    />
  );
}
