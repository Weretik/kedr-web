import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Tooltip } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';

export function CategoryViewCell({
  category,
  onView,
}: {
  category: AdminCategory;
  onView: (category: AdminCategory) => void;
}) {
  return (
    <Tooltip title="Переглянути категорію">
      <IconButton
        aria-label={`Переглянути категорію ${category.nameUk}`}
        onClick={(event) => {
          event.stopPropagation();
          onView(category);
        }}
        size="small"
      >
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
