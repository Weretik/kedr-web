import { Stack, TextField } from '@mui/material';
import { GridToolbarContainer } from '@mui/x-data-grid';
import { createContext, useContext } from 'react';

import type { ReactNode } from 'react';

export interface OrderGridToolbarProps {
  mode: 'orders' | 'drafts'; search: string; onSearch: (value: string) => void; customerFilter?: ReactNode;
}

export const OrderGridToolbarContext = createContext<OrderGridToolbarProps | null>(null);

export function OrderGridToolbar() {
  const props = useContext(OrderGridToolbarContext);
  if (!props) return null;
  return <GridToolbarContainer sx={{ px: { xs: 2, sm: 3 }, py: 2 }}><Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
    <TextField label={props.mode === 'orders' ? 'Пошук за номером або клієнтом' : 'Пошук за назвою або клієнтом'} onChange={(event) => props.onSearch(event.target.value)} size="small" value={props.search} sx={{ minWidth: { md: 300 } }} />
    {props.customerFilter}
  </Stack></GridToolbarContainer>;
}
