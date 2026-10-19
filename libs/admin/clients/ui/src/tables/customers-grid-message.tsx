import { Button, Stack, Typography } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';

export function CustomersGridMessage({ onRetry }: { onRetry?: () => void }) {
  return (
    <GridOverlay>
      <Stack spacing={1} sx={{ alignItems: 'center', p: 2, textAlign: 'center' }}>
        <Typography color={onRetry ? 'error' : 'text.secondary'}>
          {onRetry ? 'Не вдалося завантажити клієнтів.' : 'Клієнтів немає.'}
        </Typography>
        {onRetry && <Button onClick={onRetry} variant="outlined">Повторити</Button>}
      </Stack>
    </GridOverlay>
  );
}
