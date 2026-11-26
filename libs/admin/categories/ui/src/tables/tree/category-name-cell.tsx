import { siteNameOf } from '@admin/categories/model';
import { Box, Typography } from '@mui/material';

import type { CategoryTableRow } from '@admin/categories/model';

/** «Назва на сайті»: the Ukrainian site name, the Russian one under it, indented by depth (spec 003 R-001). */
export function CategoryNameCell({ row }: { row: CategoryTableRow }) {
  const { category } = row;
  return (
    <Box
      sx={{
        minWidth: 0,
        overflowWrap: 'anywhere',
        pl: row.depth * 2.5,
        py: 1,
        whiteSpace: 'normal',
      }}
    >
      <Typography
        component="span"
        sx={{
          color: category.isShownOnSite ? 'text.primary' : 'text.secondary',
          display: 'block',
          fontWeight: 700,
        }}
        variant="body2"
      >
        {siteNameOf(category, 'uk')}
      </Typography>
      <Typography
        color="text.secondary"
        component="span"
        sx={{ display: 'block' }}
        variant="caption"
      >
        {siteNameOf(category, 'ru')}
      </Typography>
    </Box>
  );
}
