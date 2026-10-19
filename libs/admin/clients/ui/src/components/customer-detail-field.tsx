import { Box, Typography } from '@mui/material';

export function CustomerDetailField({ label, value }: { label: string; value: string }) {
  return (
    <Box component="div" sx={{ minWidth: 0 }}>
      <Typography color="text.secondary" component="dt" variant="caption">{label}</Typography>
      <Typography component="dd" sx={{ fontWeight: 500, m: 0, overflowWrap: 'anywhere' }} variant="body2">
        {value}
      </Typography>
    </Box>
  );
}
