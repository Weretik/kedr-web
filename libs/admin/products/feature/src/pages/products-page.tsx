import { ProductsTableShell } from '@admin/products/ui';
import { Stack, Typography } from '@mui/material';

import { ProductsPageToolbar } from '../components/products-page-toolbar';

export function ProductsPage() {
  return (
    <Stack component="section" spacing={3}>
      <ProductsPageToolbar />
      <ProductsTableShell
        columns={[
          { id: 'name', label: 'Товар' },
          { id: 'sku', label: 'Артикул' },
          { id: 'category', label: 'Категорія' },
          { id: 'status', label: 'Статус' },
        ]}
        footer={<Typography color="text.secondary" variant="body2">Показано 0 товарів</Typography>}
        state={{ kind: 'empty', message: 'Товарів поки немає' }}
      />
    </Stack>
  );
}

export default ProductsPage;
