import { Avatar, Icon, ListRow } from '@mobile/shared/ui';

import type { Customer } from '@mobile/customers/model';

export interface CustomerRowProps {
  customer: Customer;
  onPress: () => void;
  /** The customer the manager works with now (marked with a check). */
  selected?: boolean;
}

/** A customer in the choice list: initials, name, phone or e-mail. */
export function CustomerRow({ customer, onPress, selected = false }: Readonly<CustomerRowProps>) {
  return (
    <ListRow
      accessibilityHint="Відкриває картку клієнта"
      leading={<Avatar name={customer.name} size={40} />}
      onPress={onPress}
      subtitle={customer.phone ?? customer.email}
      title={customer.name}
      trailing={selected ? <Icon name="check-circle" size={22} tone="accent" /> : undefined}
    />
  );
}
