import { Typography } from '@mui/material';

import type { SiteModelListItem } from '@admin/site-models/model';

/** «Категорія на сайті»: only the site category; where 1C keeps the products is not shown (owner, 2026-11-26). */
export function SiteModelCategoryCell({ model }: { model: SiteModelListItem }) {
  return (
    <Typography
      sx={{ overflowWrap: 'anywhere', py: 1, whiteSpace: 'normal', width: '100%' }}
      variant="body2"
    >
      {model.categoryName}
    </Typography>
  );
}
