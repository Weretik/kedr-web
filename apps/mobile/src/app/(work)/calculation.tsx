import { CalculationPanel } from '@mobile/calculation/feature';
import { CustomerBar, useConnectivity, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerSummary } from '@mobile/customers/feature';
import { createStyles, useStyles } from '@mobile/shared/ui';
import { router } from 'expo-router';
import { View } from 'react-native';

export default function CalculationRoute() {
  const styles = useStyles(stylesSheet);
  const customer = useSelectedCustomerSummary();
  const isOnline = useConnectivity()?.isOnline ?? null;

  return (
    <WorkScreen
      subheader={<CustomerBar customer={customer} onChange={() => router.navigate('/customer')} />}
      title="Розрахунок"
    >
      <View style={styles.column}>
        <CalculationPanel isOnline={isOnline} />
      </View>
    </WorkScreen>
  );
}

// Lines and totals stay readable on a tablet instead of stretching across the screen (R-017).
const stylesSheet = createStyles((theme) => ({
  column: { alignSelf: 'center', flex: 1, gap: theme.space.md, maxWidth: 880, width: '100%' },
}));
