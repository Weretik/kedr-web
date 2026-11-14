import { AppText, Card, createStyles, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

import type { CustomerDetails } from '@mobile/customers/model';

/** Phone, e-mail, and the 1C code of a customer, selectable for copying. */
export function CustomerContacts({
  customer,
}: Readonly<{ customer: Pick<CustomerDetails, 'counterpartyId' | 'email' | 'phone'> }>) {
  const styles = useStyles(stylesSheet);

  return (
    <Card style={styles.contacts}>
      <Contact label="Телефон" value={customer.phone ?? '—'} />
      <Contact label="E-mail" value={customer.email || '—'} />
      <Contact label="Код 1С" value={customer.counterpartyId} />
    </Card>
  );
}

function Contact({ label, value }: Readonly<{ label: string; value: string }>) {
  const styles = useStyles(stylesSheet);
  return (
    <View style={styles.contact}>
      <AppText style={styles.label} tone="secondary" variant="secondary">
        {label}
      </AppText>
      <AppText selectable style={styles.value} variant="body">
        {value}
      </AppText>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  contact: { flexDirection: 'row', gap: theme.space.md },
  contacts: { gap: theme.space.sm },
  label: { width: 72 },
  value: { flex: 1 },
}));
