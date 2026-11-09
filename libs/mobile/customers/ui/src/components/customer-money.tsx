import { formatKopecks } from '@mobile/customers/model';
import { AppText, Card, createStyles, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

export interface CustomerMoneyProps {
  balanceKopecks: number | null;
  debtKopecks: number | null;
}

/** Debt and balance; while 1C does not send them both are «—» with one note why (R-004). */
export function CustomerMoney({ balanceKopecks, debtKopecks }: Readonly<CustomerMoneyProps>) {
  const styles = useStyles(stylesSheet);
  const waitingFor1C = debtKopecks === null && balanceKopecks === null;

  return (
    <Card style={styles.card}>
      <View style={styles.values}>
        <Value label="Борг" value={formatKopecks(debtKopecks)} />
        <Value label="Баланс" value={formatKopecks(balanceKopecks)} />
      </View>
      {waitingFor1C ? (
        <AppText tone="secondary" variant="secondary">
          Борг і баланс з’являться, коли їх почне надсилати 1С.
        </AppText>
      ) : null}
    </Card>
  );
}

function Value({ label, value }: Readonly<{ label: string; value: string }>) {
  const styles = useStyles(stylesSheet);
  return (
    <View accessibilityLabel={`${label}: ${value}`} style={styles.value}>
      <AppText tone="secondary" variant="caption">
        {label}
      </AppText>
      <AppText numeric variant="price">
        {value}
      </AppText>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  card: { gap: theme.space.sm },
  value: { flex: 1, gap: 2 },
  values: { flexDirection: 'row', gap: theme.space.lg },
}));
