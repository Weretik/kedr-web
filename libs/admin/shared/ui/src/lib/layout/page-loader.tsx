import { Box, CircularProgress } from '@mui/material';

/** Centered loading indicator for a page area, announced by its label. */
export function PageLoader({ label }: { label: string }) {
  return (
    <Box aria-label={label} role="status" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress aria-hidden="true" />
    </Box>
  );
}
