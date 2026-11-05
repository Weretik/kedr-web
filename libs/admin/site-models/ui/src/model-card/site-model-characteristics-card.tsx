import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import { Typography } from '@mui/material';

import type { SiteModelCharacteristic } from '@admin/site-models/model';

/** Values every on-site product of the model shares; the site shows them as characteristics. */
export function SiteModelCharacteristicsCard({
  characteristics,
}: {
  characteristics: readonly SiteModelCharacteristic[];
}) {
  return (
    <SectionCard title="Характеристики">
      {characteristics.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Спільних значень у товарів моделі немає.
        </Typography>
      ) : (
        <DetailFieldList>
          {characteristics.map((item) => (
            <DetailField key={item.attributeId} label={item.name} value={item.values.join(', ')} />
          ))}
        </DetailFieldList>
      )}
    </SectionCard>
  );
}
