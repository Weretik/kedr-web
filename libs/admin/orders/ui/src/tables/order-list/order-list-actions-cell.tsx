import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Stack, Tooltip } from '@mui/material';

import type { DraftSummary, OrderSummary } from '@admin/orders/model';

export interface OrderListActions {
  onView: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (row: DraftSummary) => void;
}

export function OrderListActionsCell({
  row,
  orders,
  actions: { onView, onEdit, onDelete },
}: {
  row: OrderSummary | DraftSummary;
  orders: boolean;
  actions: OrderListActions;
}) {
  const id = orders ? (row as OrderSummary).orderId : (row as DraftSummary).draftId;
  const label = orders ? (row as OrderSummary).orderNumber : (row as DraftSummary).title;
  return (
    <Stack direction="row">
      <Tooltip title="Переглянути">
        <IconButton aria-label={`Переглянути ${label}`} onClick={() => onView(id)} size="small">
          <VisibilityOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      {!orders && onEdit && (
        <Tooltip title="Редагувати">
          <IconButton aria-label={`Редагувати ${label}`} onClick={() => onEdit?.(id)} size="small">
            <EditOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      {!orders && onDelete && (
        <Tooltip title="Видалити">
          <IconButton
            aria-label={`Видалити ${label}`}
            onClick={() => onDelete?.(row as DraftSummary)}
            size="small"
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
