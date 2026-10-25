import { StatusPill } from '@admin/shared/ui';
import { Box } from '@mui/material';

import type { AdminProductListItem } from '@admin/products/model';
import type { StatusTone } from '@admin/shared/ui';
import type { GridRenderCellParams } from '@mui/x-data-grid';

const trueLabels: Record<string, { label: string; tone: StatusTone }> = {
  inStock: { label: 'Є', tone: 'success' },
  isNew: { label: 'Новинка', tone: 'info' },
  isSale: { label: 'Акція', tone: 'warning' },
};

export function ProductsDataGridBooleanCell({
  field,
  value,
}: GridRenderCellParams<AdminProductListItem, boolean>) {
  const pill = trueLabels[field];

  if (value && pill) {
    return <StatusPill label={pill.label} tone={pill.tone} />;
  }

  if (field === 'inStock') {
    return <StatusPill label="Немає" tone="neutral" />;
  }

  return (
    <Box
      aria-label={value ? 'Так' : 'Ні'}
      component="span"
      role="img"
      sx={{ color: 'text.disabled' }}
    >
      {value ? 'Так' : '—'}
    </Box>
  );
}
