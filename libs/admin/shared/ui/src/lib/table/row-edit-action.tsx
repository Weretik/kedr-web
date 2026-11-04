import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { IconButton, Tooltip } from '@mui/material';

interface RowEditActionProps {
  /** Tooltip, for example «Редагувати категорію». */
  title: string;
  /** Accessible name that names the row, for example «Редагувати категорію Завіси». */
  label: string;
  onEdit: () => void;
}

/** Pencil in a table «Дії» column; it opens the same edit panel as «Редагувати» on the detail page. */
export function RowEditAction({ label, onEdit, title }: RowEditActionProps) {
  return (
    <Tooltip title={title}>
      <IconButton
        aria-label={label}
        onClick={(event) => {
          event.stopPropagation();
          onEdit();
        }}
        size="small"
      >
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
