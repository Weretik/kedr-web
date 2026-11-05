import { CalculationPanel } from '@mobile/calculation/feature';
import { CustomerBar, useConnectivity, WorkScreen } from '@mobile/core/shell';
import { useSelectedCustomerSummary } from '@mobile/customers/feature';
import { router } from 'expo-router';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export default function CalculationRoute() {
  const customer = useSelectedCustomerSummary();
  const isOnline = useConnectivity()?.isOnline ?? null;

  return (
    <WorkScreen title="Розрахунок">
      <View style={styles.column}>
        <CustomerBar customer={customer} onChange={() => router.navigate('/customer')} />
        <CalculationPanel isOnline={isOnline} />
      </View>
    </WorkScreen>
  );
}

// Lines and totals stay readable on a tablet instead of stretching across the screen (R-017).
const styles = StyleSheet.create((theme) => ({
  column: { alignSelf: 'center', flex: 1, gap: theme.space.md, maxWidth: 880, width: '100%' },
}));
