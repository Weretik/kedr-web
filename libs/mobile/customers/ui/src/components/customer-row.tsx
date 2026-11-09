import { Avatar, Icon, ListRow } from '@mobile/shared/ui';
import { memo } from 'react';

import type { Customer } from '@mobile/customers/model';

export interface CustomerRowProps {
  customer: Customer;
  /** Gets the customer's id, so the list can pass one stable callback to every row. */
  onPick: (counterpartyId: string) => void;
  /** The customer the manager works with now (marked with a check). */
  selected?: boolean;
}

/** A customer in the choice list: initials, name, phone or e-mail. Re-renders only when its own props change. */
export const CustomerRow = memo(function CustomerRow({
  customer,
  onPick,
  selected = false,
}: Readonly<CustomerRowProps>) {
  return (
    <ListRow
      accessibilityHint="Відкриває картку клієнта"
      leading={<Avatar name={customer.name} size={40} />}
      onPress={() => onPick(customer.counterpartyId)}
      subtitle={customer.phone ?? customer.email}
      title={customer.name}
      trailing={selected ? <Icon name="check-circle" size={22} tone="accent" /> : undefined}
    />
  );
});
