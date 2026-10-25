import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';

import { CustomerDetailField } from './customer-detail-field';

import type { CustomerDetail } from '@admin/clients/model';

type CategoryPriceType = CustomerDetail['categoryPriceTypes'][number];

export function CustomerPriceTypesCard({
  categoryPriceTypes,
  defaultPriceTypeName,
}: {
  categoryPriceTypes: readonly CategoryPriceType[];
  defaultPriceTypeName: string | null;
}) {
  return (
    <Card
      aria-labelledby="customer-prices-title"
      component="section"
      sx={{ minWidth: 0 }}
      variant="outlined"
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Stack spacing={1.5}>
          <Typography component="h2" id="customer-prices-title" variant="h6">
            Типи цін
          </Typography>
          <Box component="dl" sx={{ m: 0 }}>
            <CustomerDetailField
              label="За замовчуванням"
              value={defaultPriceTypeName ?? 'Назва недоступна'}
            />
          </Box>
          {categoryPriceTypes.length > 0 && (
            <>
              <Divider />
              <Box component="dl" sx={{ display: 'grid', gap: 1.5, m: 0 }}>
                {categoryPriceTypes.map(
                  ({ categoryId, categoryName, priceTypeId, priceTypeName }) => (
                    <CustomerDetailField
                      key={`${categoryId}-${priceTypeId}`}
                      label={`${categoryName ?? 'Назва недоступна'} · ID ${categoryId}`}
                      value={priceTypeName ?? 'Назва недоступна'}
                    />
                  ),
                )}
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
