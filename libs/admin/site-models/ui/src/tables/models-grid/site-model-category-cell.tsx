import { oneCCategoriesNote } from '@admin/site-models/model';
import { Stack, Typography } from '@mui/material';

import type { SiteModelListItem } from '@admin/site-models/model';

/** «Категорія на сайті»: the site category, and «У 1С: …» below it when 1C differs. */
export function SiteModelCategoryCell({ model }: { model: SiteModelListItem }) {
  const note = oneCCategoriesNote(model.oneCCategories);
  return (
    <Stack spacing={0.25} sx={{ py: 1, width: '100%' }}>
      <Typography sx={{ overflowWrap: 'anywhere', whiteSpace: 'normal' }} variant="body2">
        {model.categoryName}
      </Typography>
      {note ? (
        <Typography
          color="text.secondary"
          sx={{ overflowWrap: 'anywhere', whiteSpace: 'normal' }}
          variant="caption"
        >
          {note}
        </Typography>
      ) : null}
    </Stack>
  );
}
