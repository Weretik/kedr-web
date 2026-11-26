import { RowEditAction } from '@admin/shared/ui';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Tooltip } from '@mui/material';

import type { SiteModelListItem } from '@admin/site-models/model';

interface SiteModelActionsCellProps {
  model: SiteModelListItem;
  onView: (model: SiteModelListItem) => void;
  onEdit?: (model: SiteModelListItem) => void;
}

/** «Дії» of a model row: the eye opens the model page, the pencil the edit panel. */
export function SiteModelActionsCell({ model, onEdit, onView }: SiteModelActionsCellProps) {
  return (
    <>
      <Tooltip title="Переглянути модель">
        <IconButton
          aria-label={`Переглянути модель ${model.name}`}
          onClick={() => onView(model)}
          size="small"
        >
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {onEdit ? (
        <RowEditAction
          label={`Редагувати модель ${model.name}`}
          onEdit={() => onEdit(model)}
          title="Редагувати модель"
        />
      ) : null}
    </>
  );
}
