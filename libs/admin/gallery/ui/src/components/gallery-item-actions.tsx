import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';

interface GalleryItemActionsProps {
  /** Name used in the button labels. */
  name: string;
  index: number;
  count: number;
  disabled: boolean;
  onMove: (to: number) => void;
  onEdit: () => void;
  onRemove: () => void;
}

/** Move earlier or later, edit texts, and remove from the gallery. */
export function GalleryItemActions({
  count,
  disabled,
  index,
  name,
  onEdit,
  onMove,
  onRemove,
}: GalleryItemActionsProps) {
  return (
    <Stack
      direction="row"
      sx={{ alignItems: 'center', borderTop: 1, borderColor: 'divider', px: 0.5 }}
    >
      <Tooltip title="Раніше">
        <span>
          <IconButton
            aria-label={`Перемістити «${name}» раніше`}
            disabled={disabled || index === 0}
            onClick={() => onMove(index - 1)}
            size="small"
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Пізніше">
        <span>
          <IconButton
            aria-label={`Перемістити «${name}» пізніше`}
            disabled={disabled || index === count - 1}
            onClick={() => onMove(index + 1)}
            size="small"
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Box sx={{ flex: 1 }} />
      <Tooltip title="Назва та підпис">
        <IconButton aria-label={`Редагувати «${name}»`} onClick={onEdit} size="small">
          <EditOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Прибрати з галереї">
        <IconButton aria-label={`Прибрати «${name}» з галереї`} onClick={onRemove} size="small">
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
