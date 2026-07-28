import { Stack, Typography } from '@mui/material';

import type { PropsWithChildren, ReactNode } from 'react';

interface ProductsPageToolbarProps extends PropsWithChildren {
  actions?: ReactNode;
}

export function ProductsPageToolbar({ actions, children }: ProductsPageToolbarProps) {
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
      {children}
    </Stack>
  );
}
