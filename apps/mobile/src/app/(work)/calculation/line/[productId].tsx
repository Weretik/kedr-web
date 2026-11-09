import { CalculationLineSheet } from '@mobile/calculation/feature';
import { router, useLocalSearchParams } from 'expo-router';

/** Quantity and price of one calculation line, as a sheet over the calculation. */
export default function CalculationLineRoute() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  return (
    <CalculationLineSheet
      onClose={() => (router.canGoBack() ? router.back() : router.replace('/calculation'))}
      productId={Number(productId)}
    />
  );
}
