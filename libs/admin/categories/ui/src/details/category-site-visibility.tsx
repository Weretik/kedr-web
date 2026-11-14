import { StatusPill } from '@admin/shared/ui';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';

interface CategorySiteVisibilityProps {
  category: AdminCategory;
  /** Administrators only: asks to show or hide the category on the site. */
  onToggleSite?: () => void;
}

/** Whether the category is on the site, with the show or hide action. */
export function CategorySiteVisibility({ category, onToggleSite }: CategorySiteVisibilityProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
    >
      {category.isShownOnSite ? (
        <Typography variant="body2">Показується на сайті</Typography>
      ) : (
        <Box>
          <StatusPill label="Не показується на сайті" tone="warning" />
        </Box>
      )}
      {onToggleSite ? (
        <Button
          color={category.isShownOnSite ? 'inherit' : 'primary'}
          onClick={onToggleSite}
          size="small"
          startIcon={
            category.isShownOnSite ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />
          }
          variant="outlined"
        >
          {category.isShownOnSite ? 'Сховати з сайту' : 'Показати на сайті'}
        </Button>
      ) : null}
    </Stack>
  );
}
