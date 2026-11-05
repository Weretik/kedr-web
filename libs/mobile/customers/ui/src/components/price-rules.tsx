import { AppText, Card } from '@mobile/shared/ui';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import type { CustomerPriceRule } from '@mobile/customers/model';

export interface PriceRulesProps {
  defaultPriceTypeName: string | null;
  rules: readonly CustomerPriceRule[];
}

/** The customer's price type and the categories priced by another type, as in Admin. */
export function PriceRules({ defaultPriceTypeName, rules }: Readonly<PriceRulesProps>) {
  return (
    <Card style={styles.card}>
      <View style={styles.line}>
        <AppText style={styles.label} tone="secondary" variant="secondary">
          Тип ціни
        </AppText>
        <AppText variant="bodyStrong">{defaultPriceTypeName ?? 'Не визначено'}</AppText>
      </View>
      {rules.length > 0 ? (
        <>
          <AppText tone="secondary" variant="caption">
            Ціни за категоріями
          </AppText>
          {rules.map((rule) => (
            <View key={rule.categoryId} style={styles.line}>
              <AppText style={styles.label} variant="body">
                {rule.categoryName ?? `Категорія ${rule.categoryId}`}
              </AppText>
              <AppText variant="bodyStrong">
                {rule.priceTypeName ?? `Тип ${rule.priceTypeId}`}
              </AppText>
            </View>
          ))}
        </>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create((theme) => ({
  card: { gap: theme.space.sm },
  label: { flex: 1 },
  line: { alignItems: 'center', flexDirection: 'row', gap: theme.space.md },
}));
