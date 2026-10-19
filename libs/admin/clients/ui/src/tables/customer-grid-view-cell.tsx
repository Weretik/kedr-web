import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Tooltip } from '@mui/material';

export function CustomerGridViewCell({
  counterpartyId,
  name,
  onView,
}: {
  counterpartyId: string;
  name: string;
  onView: (counterpartyId: string) => void;
}) {
  return (
    <Tooltip title="Переглянути клієнта">
      <IconButton
        aria-label={`Переглянути клієнта ${name}`}
        onClick={(event) => {
          event.stopPropagation();
          onView(counterpartyId);
        }}
        size="small"
      >
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
