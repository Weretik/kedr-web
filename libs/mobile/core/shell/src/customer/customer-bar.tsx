import { AppText, createStyles, Icon, useStyles } from '@mobile/shared/ui';
import { Pressable } from 'react-native';

export interface CustomerBarCustomer {
  name: string;
  priceTypeName: string | null;
}

export interface CustomerBarProps {
  customer: CustomerBarCustomer | null;
  onChange: () => void;
}

/** «*ОПТ $» → «ОПТ $»: the leading asterisk is a 1C marker, not part of the name managers know. */
export const priceTypeLabel = (name: string | null): string =>
  name?.replace(/^\*+\s*/, '').trim() || 'не визначено';

/** The chosen customer as one thin line under the screen title; a tap opens customer choice. */
export function CustomerBar({ customer, onChange }: Readonly<CustomerBarProps>) {
  const styles = useStyles(stylesSheet);
  const prices = customer ? `ціни ${priceTypeLabel(customer.priceTypeName)}` : null;
  return (
    <Pressable
      accessibilityHint="Відкриває вибір клієнта"
      accessibilityLabel={
        customer ? `Клієнт ${customer.name}, ${prices}. Змінити` : 'Обрати клієнта'
      }
      accessibilityRole="button"
      hitSlop={6}
      onPress={onChange}
      style={({ pressed }) => styles.line(pressed)}
    >
      <AppText numberOfLines={1} style={styles.text} tone="secondary" variant="secondary">
        {customer ? (
          <>
            <AppText tone="default" variant="secondaryStrong">
              {customer.name}
            </AppText>
            {` · ${prices}`}
          </>
        ) : (
          'Клієнта не обрано · обрати'
        )}
      </AppText>
      <Icon name="chevron-down" size={18} tone="secondary" />
    </Pressable>
  );
}

const stylesSheet = createStyles((theme) => ({
  line: (pressed: boolean) => ({
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: theme.space.xs,
    maxWidth: '100%',
    opacity: pressed ? theme.motion.pressedOpacity : 1,
  }),
  text: { flexShrink: 1 },
}));
