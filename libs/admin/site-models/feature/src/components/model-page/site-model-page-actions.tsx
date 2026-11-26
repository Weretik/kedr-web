import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Button } from '@mui/material';

interface SiteModelPageActionsProps {
  proposed: boolean;
  busy: boolean;
  onAccept: () => void;
  onEdit: () => void;
}

/** Actions of the model page header: «Погодити» for a proposal and «Редагувати». */
export function SiteModelPageActions({
  busy,
  onAccept,
  onEdit,
  proposed,
}: SiteModelPageActionsProps) {
  return (
    <>
      {proposed ? (
        <Button
          disabled={busy}
          onClick={onAccept}
          startIcon={<CheckOutlinedIcon />}
          variant="outlined"
        >
          Погодити
        </Button>
      ) : null}
      <Button onClick={onEdit} startIcon={<EditOutlinedIcon />} variant="contained">
        Редагувати
      </Button>
    </>
  );
}
