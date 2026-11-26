import { StatusPill } from '@admin/shared/ui';
import { Stack, Typography } from '@mui/material';

import type { SiteModelListItem } from '@admin/site-models/model';

/** «Модель»: the name; a proposal carries «Не перевірена». */
export function SiteModelNameCell({ model }: { model: SiteModelListItem }) {
  return (
    <Stack spacing={0.5} sx={{ alignItems: 'flex-start', py: 1, width: '100%' }}>
      <Typography
        sx={{ fontWeight: 600, overflowWrap: 'anywhere', whiteSpace: 'normal' }}
        variant="body2"
      >
        {model.name}
      </Typography>
      {model.status === 'proposed' ? <StatusPill label="Не перевірена" tone="info" /> : null}
    </Stack>
  );
}
