import { Pressable, View } from 'react-native';

import { createStyles, useStyles } from '../../theme/create-styles';
import { AppText } from '../text/app-text';
import { Icon } from '../text/icon';

export interface QuantityStepperProps {
  /** Names the product so screen readers say what changes. */
  itemLabel: string;
  max?: number;
  min?: number;
  onChange: (quantity: number) => void;
  value: number;
}

/** − qty +, 36 high. The value never leaves [min, max]. */
export function QuantityStepper({
  itemLabel,
  max = Number.MAX_SAFE_INTEGER,
  min = 1,
  onChange,
  value,
}: Readonly<QuantityStepperProps>) {
  const styles = useStyles(stylesSheet);
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View
      accessibilityLabel={`Кількість: ${itemLabel}`}
      accessibilityRole="adjustable"
      accessibilityValue={{ max, min, now: value }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment' && canIncrease) onChange(value + 1);
        if (event.nativeEvent.actionName === 'decrement' && canDecrease) onChange(value - 1);
      }}
      style={styles.stepper}
    >
      <Pressable
        accessibilityLabel={`Зменшити кількість: ${itemLabel}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canDecrease }}
        disabled={!canDecrease}
        hitSlop={6}
        onPress={() => onChange(value - 1)}
        style={styles.step}
      >
        <Icon name="minus" size={18} tone={canDecrease ? 'default' : 'disabled'} />
      </Pressable>
      <AppText numeric style={styles.value} variant="bodyStrong">
        {value}
      </AppText>
      <Pressable
        accessibilityLabel={`Збільшити кількість: ${itemLabel}`}
        accessibilityRole="button"
        accessibilityState={{ disabled: !canIncrease }}
        disabled={!canIncrease}
        hitSlop={6}
        onPress={() => onChange(value + 1)}
        style={styles.step}
      >
        <Icon name="plus" size={18} tone={canIncrease ? 'default' : 'disabled'} />
      </Pressable>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  step: {
    alignItems: 'center',
    height: theme.sizes.stepper,
    justifyContent: 'center',
    width: theme.sizes.stepper,
  },
  stepper: {
    alignItems: 'center',
    borderColor: theme.colors.outline,
    borderRadius: theme.radius.md,
    borderWidth: theme.sizes.border,
    flexDirection: 'row',
  },
  value: { minWidth: 32, textAlign: 'center' },
}));
