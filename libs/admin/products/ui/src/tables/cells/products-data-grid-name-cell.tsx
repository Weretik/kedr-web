import { problemLabel } from '@admin/products/model';
import { StatusPill } from '@admin/shared/ui';
import { Stack, Tooltip, Typography } from '@mui/material';

import type { AdminProductListItem } from '@admin/products/model';
import type { GridRenderCellParams } from '@mui/x-data-grid';

/** The product name and, when its attributes need review, the first reason in red (others in the tooltip). */
export function ProductsDataGridNameCell({ row }: GridRenderCellParams<AdminProductListItem>) {
  const [first, ...rest] = row.problems;

  return (
    <Stack spacing={0.5} sx={{ alignItems: 'flex-start', py: 1, width: '100%' }}>
      <Typography
        sx={{ fontWeight: 600, overflowWrap: 'anywhere', whiteSpace: 'normal', width: '100%' }}
        variant="body2"
      >
        {row.nameUk}
      </Typography>
      {first ? (
        <Tooltip
          title={row.problems.map((problem) => problem.text ?? problemLabel(problem)).join('\n')}
          slotProps={{ tooltip: { sx: { whiteSpace: 'pre-line' } } }}
        >
          <span>
            <StatusPill
              label={
                rest.length > 0 ? `${problemLabel(first)} +${rest.length}` : problemLabel(first)
              }
              tone="error"
            />
          </span>
        </Tooltip>
      ) : null}
    </Stack>
  );
}
