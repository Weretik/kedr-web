import { Stack, Typography } from '@mui/material';

import type { ReactNode } from 'react';

interface ProductsPageToolbarProps {
  actions?: ReactNode;
}

export function ProductsPageToolbar({ actions }: ProductsPageToolbarProps) {
  return (
    <Stack component="section" spacing={2}>
      <Stack
        direction={{ sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Typography variant="h4">Каталог товарів</Typography>
        {actions}
      </Stack>
    </Stack>
  );
}
