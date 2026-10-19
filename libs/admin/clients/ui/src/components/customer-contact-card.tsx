import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

import { CustomerDetailField } from './customer-detail-field';

export function CustomerContactCard({ email, phone }: { email: string | null; phone: string | null }) {
  return (
    <Card aria-labelledby="customer-contacts-title" component="section" sx={{ minWidth: 0 }} variant="outlined">
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1.5}>
          <Typography component="h2" id="customer-contacts-title" variant="h6">Контактні дані</Typography>
          <Box component="dl" sx={{ display: 'grid', gap: 1.5, m: 0 }}>
            <CustomerDetailField label="Телефон" value={phone || 'Не вказано'} />
            <CustomerDetailField label="Email" value={email || 'Не вказано'} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
