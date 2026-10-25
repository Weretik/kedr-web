import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { GridOverlay } from '@mui/x-data-grid';

interface DataGridMessageOverlayProps {
  message: string;
  /** When set, the overlay shows an error with a retry button. */
  onRetry?: () => void;
}

/** Empty or error state inside a Data Grid: icon, message, and an optional retry. */
export function DataGridMessageOverlay({ message, onRetry }: DataGridMessageOverlayProps) {
  const isError = Boolean(onRetry);

  return (
    <GridOverlay>
      <Stack
        role={isError ? 'alert' : undefined}
        spacing={1.5}
        sx={{ alignItems: 'center', maxWidth: 360, p: 3, textAlign: 'center' }}
      >
        <Box
          aria-hidden="true"
          sx={{
            alignItems: 'center',
            bgcolor: isError ? 'error.light' : 'primary.light',
            borderRadius: '14px',
            color: isError ? 'error.main' : 'primary.dark',
            display: 'flex',
            height: 48,
            justifyContent: 'center',
            width: 48,
          }}
        >
          {isError ? <ErrorOutlineOutlinedIcon /> : <InboxOutlinedIcon />}
        </Box>
        <Typography color={isError ? 'text.primary' : 'text.secondary'} variant="subtitle2">
          {message}
        </Typography>
        {onRetry ? (
          <Button onClick={onRetry} size="small" variant="outlined">
            Повторити
          </Button>
        ) : null}
      </Stack>
    </GridOverlay>
  );
}
