import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import { Divider } from '@mui/material';

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
    <SectionCard title="Типи цін">
      <DetailFieldList>
        <DetailField label="За замовчуванням" value={defaultPriceTypeName ?? 'Назва недоступна'} />
      </DetailFieldList>
      {categoryPriceTypes.length > 0 && (
        <>
          <Divider />
          <DetailFieldList>
            {categoryPriceTypes.map(({ categoryId, categoryName, priceTypeId, priceTypeName }) => (
              <DetailField
                key={`${categoryId}-${priceTypeId}`}
                label={`${categoryName ?? 'Назва недоступна'} · ID ${categoryId}`}
                value={priceTypeName ?? 'Назва недоступна'}
              />
            ))}
          </DetailFieldList>
        </>
      )}
    </SectionCard>
  );
}
