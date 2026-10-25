import { AdminPageHeader } from '@admin/shared/ui';
import { Stack } from '@mui/material';

import type { PropsWithChildren, ReactNode } from 'react';

interface ProductsPageToolbarProps extends PropsWithChildren {
  actions?: ReactNode;
}

export function ProductsPageToolbar({ actions, children }: ProductsPageToolbarProps) {
  return (
    <Stack component="section" spacing={2}>
      <AdminPageHeader actions={actions} title="Каталог товарів" />
      {children}
    </Stack>
  );
}
