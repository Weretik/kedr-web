import { Alert, Snackbar } from '@mui/material';

/** Short success confirmation at the top of the screen, where it is seen on any screen size. */
export function NoticeSnackbar({
  message,
  onClose,
}: {
  message: string | null | undefined;
  onClose: () => void;
}) {
  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      autoHideDuration={4000}
      onClose={onClose}
      open={Boolean(message)}
      sx={{ top: { xs: 80, sm: 88 } }}
    >
      <Alert onClose={onClose} severity="success" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
