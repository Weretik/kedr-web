import { Box, Typography } from '@mui/material';

import type { ReactNode } from 'react';

/** One label and value pair; place it inside a `dl` such as `DetailFieldList`. */
export function DetailField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        color="text.secondary"
        component="dt"
        sx={{ display: 'block', mb: 0.25 }}
        variant="caption"
      >
        {label}
      </Typography>
      <Typography
        component="dd"
        sx={{ fontWeight: 600, m: 0, overflowWrap: 'anywhere' }}
        variant="body2"
      >
        {value}
      </Typography>
    </Box>
  );
}

/** Description list of `DetailField`s in one or two columns. */
export function DetailFieldList({
  children,
  columns = 1,
}: {
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <Box
      component="dl"
      sx={{
        columnGap: 3,
        display: 'grid',
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: `repeat(${columns}, minmax(0, 1fr))` },
        m: 0,
        rowGap: 2,
      }}
    >
      {children}
    </Box>
  );
}
