import { Autocomplete, TextField } from '@mui/material';

import { useCustomerOptions } from './use-customer-options';

import type { CustomerListItem } from '@admin/clients/model';
import type { CustomerPickerProps } from '@admin/orders/feature';

/** App slot: the orders feature picks a customer from the clients domain through this picker. */
export function CustomerPicker({ value, onChange, label }: CustomerPickerProps) {
  const customers = useCustomerOptions(value);

  return (
    <Autocomplete<CustomerListItem>
      autoHighlight
      filterOptions={(values) => values}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, chosen) => option.counterpartyId === chosen.counterpartyId}
      loading={customers.loading}
      slotProps={{ listbox: { onScroll: customers.onListboxScroll } }}
      onChange={(_event, option) => onChange(option?.counterpartyId ?? '', option?.name ?? '')}
      onInputChange={(_event, next, reason) => {
        if (reason === 'input') customers.setInput(next);
      }}
      options={customers.options}
      renderInput={(parameters) => (
        <TextField
          {...parameters}
          label={label}
          size="small"
          helperText={customers.failed ? 'Не вдалося завантажити клієнтів.' : undefined}
        />
      )}
      sx={{ minWidth: { sm: 240 }, width: { xs: '100%', md: 340 } }}
      value={customers.chosen}
    />
  );
}
