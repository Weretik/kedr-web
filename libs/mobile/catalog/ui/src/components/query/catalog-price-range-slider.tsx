import { RangeSlider } from '@react-native-assets/slider';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const MIN_PRICE = 0;
const MAX_PRICE = 20_000;
const PRICE_STEP = 100;

export function CatalogPriceRangeSlider({
  priceFrom,
  priceTo,
  onChange,
}: Readonly<{
  onChange: (range: readonly [number, number]) => void;
  priceFrom?: number;
  priceTo?: number;
}>) {
  const theme = useTheme();
  const committedRange = useMemo<[number, number]>(
    () => [priceFrom ?? MIN_PRICE, priceTo ?? MAX_PRICE],
    [priceFrom, priceTo],
  );
  const [displayedRange, setDisplayedRange] = useState(committedRange);

  useEffect(() => setDisplayedRange(committedRange), [committedRange]);

  return (
    <View accessibilityLabel="Діапазон цін" style={styles.container}>
      <Text variant="titleSmall">Ціна</Text>
      <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
        {formatPrice(displayedRange[0])} — {formatPrice(displayedRange[1])}
      </Text>
      <RangeSlider
        crossingAllowed={false}
        inboundColor={theme.colors.primary}
        maximumValue={MAX_PRICE}
        minimumRange={PRICE_STEP}
        minimumValue={MIN_PRICE}
        onSlidingComplete={onChange}
        onValueChange={setDisplayedRange}
        outboundColor={theme.colors.outlineVariant}
        range={committedRange}
        slideOnTap
        step={PRICE_STEP}
        style={styles.slider}
        thumbSize={18}
        thumbTintColor={theme.colors.primary}
        trackHeight={3}
      />
    </View>
  );
}

function formatPrice(value: number) {
  return value.toLocaleString('uk-UA');
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  slider: { height: 42, marginHorizontal: 2 },
});
