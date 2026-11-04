import { RowEditAction } from '@admin/shared/ui';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Tooltip } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';

/** «Дії» of a category row: view, and edit for administrators. */
export function CategoryViewCell({
  category,
  onEdit,
  onView,
}: {
  category: AdminCategory;
  onView: (category: AdminCategory) => void;
  onEdit?: (category: AdminCategory) => void;
}) {
  return (
    <>
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
      {onEdit ? (
        <RowEditAction
          label={`Редагувати категорію ${category.nameUk}`}
          onEdit={() => onEdit(category)}
          title="Редагувати категорію"
        />
      ) : null}
    </>
  );
}
