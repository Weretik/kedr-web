import { Alert, Snackbar } from '@mui/material';

/** Short confirmation after a saved change. */
export function SuccessSnackbar({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  return (
    <Snackbar autoHideDuration={4000} onClose={onClose} open={message !== null}>
      <Alert onClose={onClose} severity="success" variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
}
