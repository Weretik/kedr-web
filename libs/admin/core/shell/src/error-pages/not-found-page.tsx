import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { ErrorScreen } from './error-screen';

/** 404 inside the admin layout for an address that no route matches. */
export function NotFoundPage() {
  return (
    <ErrorScreen
      actions={
        <Button component={RouterLink} to="/dashboard" variant="contained">
          На головну
        </Button>
      }
      code="404"
      description="Можливо, сторінку видалили або адресу введено з помилкою."
      title="Сторінку не знайдено"
    />
  );
}
