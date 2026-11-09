import { AppText, Avatar, Chip, createStyles, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

export interface CustomerBarCustomer {
  name: string;
  priceTypeName: string | null;
}

export interface CustomerBarProps {
  customer: CustomerBarCustomer | null;
  onChange: () => void;
}

/** The chosen customer on top of every working screen, with «Змінити». */
export function CustomerBar({ customer, onChange }: Readonly<CustomerBarProps>) {
  const styles = useStyles(stylesSheet);
  return (
    <View style={styles.bar}>
      <Avatar name={customer?.name ?? '?'} size={40} />
      <View style={styles.text}>
        <AppText numberOfLines={1} variant="bodyStrong">
          {customer?.name ?? 'Клієнта не обрано'}
        </AppText>
        <AppText numberOfLines={1} tone="secondary" variant="secondary">
          {customer
            ? `Ціни: ${customer.priceTypeName ?? 'не визначено'}`
            : 'Оберіть клієнта, щоб бачити його ціни'}
        </AppText>
      </View>
      <Chip label={customer ? 'Змінити' : 'Обрати'} onPress={onChange} />
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  bar: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.outlineVariant,
    borderRadius: theme.radius.lg,
    borderWidth: theme.sizes.border,
    flexDirection: 'row',
    gap: theme.space.md,
    padding: theme.space.md,
  },
  text: { flex: 1, gap: 2 },
}));
