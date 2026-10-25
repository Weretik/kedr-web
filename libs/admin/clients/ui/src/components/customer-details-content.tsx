import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import { Box } from '@mui/material';

import { CustomerContactCard } from './customer-contact-card';
import { CustomerPriceTypesCard } from './customer-price-types-card';

import type { CustomerDetail } from '@admin/clients/model';

export function CustomerDetailsContent({ customer }: { customer: CustomerDetail }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 3,
        gridAutoRows: { md: '1fr' },
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
        minWidth: 0,
      }}
    >
      <SectionCard
        as="article"
        eyebrow="Основна інформація"
        sx={{ gridColumn: '1 / -1' }}
        title={customer.name}
        titleVariant="h5"
      >
        <DetailFieldList>
          <DetailField label="ID клієнта" value={customer.counterpartyId} />
        </DetailFieldList>
      </SectionCard>
      <CustomerContactCard email={customer.email} phone={customer.phone} />
      <CustomerPriceTypesCard
        categoryPriceTypes={customer.categoryPriceTypes}
        defaultPriceTypeName={customer.defaultPriceTypeName}
      />
    </Box>
  );
}
