import { Box, CircularProgress, Typography } from '@mui/material';

export function RouteLoadingFallback() {
  return (
    <Box
      aria-label="Завантаження сторінки"
      role="status"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        justifyContent: 'center',
        minHeight: 240,
      }}
    >
      <CircularProgress />
      <Typography>Завантаження сторінки…</Typography>
    </Box>
  );
}
