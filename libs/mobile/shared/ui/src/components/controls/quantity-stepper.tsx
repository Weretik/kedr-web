import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { useBump } from '../../hooks/use-bump';
import { useKedrTheme } from '../../theme/kedr-theme';
import { tabularNumbers } from '../../theme/typography';

export interface QuantityStepperProps {
  /** Product name used in accessible labels. */
  itemName: string;
  max?: number;
  min?: number;
  onDecrement: () => void;
  onIncrement: () => void;
  orientation?: 'horizontal' | 'vertical';
  /** `inverse` sits on the dark action bar. */
  tone?: 'default' | 'inverse';
  value: number;
}

export function QuantityStepper({
  itemName,
  max = Number.POSITIVE_INFINITY,
  min = 1,
  onDecrement,
  onIncrement,
  orientation = 'horizontal',
  tone = 'default',
  value,
}: Readonly<QuantityStepperProps>) {
  const { kedr } = useKedrTheme();
  const scale = useBump(value);
  const color = tone === 'inverse' ? kedr.colors.inverseOnSurface : kedr.colors.onSurface;
  const groove = tone === 'inverse' ? 'rgba(127,127,127,0.24)' : kedr.colors.surfaceVariant;
  const canDecrement = value > min;
  const canIncrement = value < max;
  const vertical = orientation === 'vertical';

  const button = (kind: 'minus' | 'plus') => {
    const enabled = kind === 'plus' ? canIncrement : canDecrement;
    return (
      <Pressable
        accessibilityLabel={`${kind === 'plus' ? 'Збільшити' : 'Зменшити'} кількість ${itemName}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: !enabled }}
        disabled={!enabled}
        hitSlop={4}
        onPress={kind === 'plus' ? onIncrement : onDecrement}
        style={[styles.button, { opacity: enabled ? 1 : 0.35 }]}
      >
        <Icon color={color} size={18} source={kind} />
      </Pressable>
    );
  };

  return (
    <View
      style={[
        styles.root,
        vertical ? styles.vertical : styles.horizontal,
        { backgroundColor: groove, borderRadius: kedr.radius.pill },
      ]}
    >
      {vertical ? button('plus') : button('minus')}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Text
          accessibilityLabel={`Кількість ${itemName}: ${value}`}
          style={[styles.value, tabularNumbers, { color }]}
          variant="labelLarge"
        >
          {value}
        </Text>
      </Animated.View>
      {vertical ? button('minus') : button('plus')}
    </View>
  );
}

const styles = StyleSheet.create({
  button: { alignItems: 'center', height: 40, justifyContent: 'center', width: 40 },
  horizontal: { flexDirection: 'row' },
  root: { alignItems: 'center', padding: 2 },
  value: { minWidth: 24, textAlign: 'center' },
  vertical: { flexDirection: 'column' },
});
