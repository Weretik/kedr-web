import type { CustomerDetail } from '@admin/clients/model';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

import { CustomerContactCard } from './customer-contact-card';
import { CustomerDetailField } from './customer-detail-field';
import { CustomerPriceTypesCard } from './customer-price-types-card';

export function CustomerDetailsContent({ customer }: { customer: CustomerDetail }) {
  return (
    <Box sx={{
      alignItems: 'start',
      display: 'grid',
      gap: 2,
      gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
      minWidth: 0,
    }}>
      <Card aria-labelledby="customer-detail-name" component="article" sx={{ minWidth: 0 }} variant="outlined">
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Stack spacing={1.5}>
            <Typography color="text.secondary" component="p" variant="subtitle2">Основна інформація</Typography>
            <Typography component="h2" id="customer-detail-name" sx={{ overflowWrap: 'anywhere' }} variant="h5">{customer.name}</Typography>
            <Box component="dl" sx={{ m: 0 }}>
              <CustomerDetailField label="ID клієнта" value={customer.counterpartyId} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <CustomerContactCard email={customer.email} phone={customer.phone} />
      <CustomerPriceTypesCard
        categoryPriceTypes={customer.categoryPriceTypes}
        defaultPriceTypeName={customer.defaultPriceTypeName}
      />
    </Box>
  );
}
