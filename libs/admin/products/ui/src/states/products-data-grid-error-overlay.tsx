import { Button, Stack, Typography } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';

interface ProductsDataGridErrorOverlayProps {
  message: string;
  onRetry: () => void;
}

export function ProductsDataGridErrorOverlay({ message, onRetry }: ProductsDataGridErrorOverlayProps) {
  return (
    <GridOverlay>
      <Stack spacing={1} sx={{ alignItems: 'center', maxWidth: 360, textAlign: 'center' }}>
        <Typography color="error">{message}</Typography>
        <Button onClick={onRetry} size="small" variant="outlined">
          Повторити
        </Button>
      </Stack>
    </GridOverlay>
  );
}
