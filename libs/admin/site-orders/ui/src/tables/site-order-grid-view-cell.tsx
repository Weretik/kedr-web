import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { IconButton, Tooltip } from '@mui/material';

export function SiteOrderGridViewCell({
  name,
  orderId,
  onView,
}: {
  name: string;
  orderId: string;
  onView: (orderId: string) => void;
}) {
  return (
    <Tooltip title="Переглянути замовлення">
      <IconButton
        aria-label={`Переглянути замовлення ${name}`}
        onClick={(event) => {
          event.stopPropagation();
          onView(orderId);
        }}
        size="small"
      >
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
