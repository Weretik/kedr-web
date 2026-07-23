import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import type { ReactNode } from 'react';

export type ProductsTableState =
  | { kind: 'loading'; message?: string }
  | { kind: 'empty'; message: string }
  | { kind: 'error'; message: string; onRetry?: () => void }
  | { kind: 'ready'; rows: ReactNode };

export interface ProductsTableColumn {
  align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
  id: string;
  label: string;
}

interface ProductsTableShellProps {
  columns: readonly ProductsTableColumn[];
  footer?: ReactNode;
  state: ProductsTableState;
}

export function ProductsTableShell({ columns, footer, state }: ProductsTableShellProps) {
  return (
    <Card>
      {state.kind === 'error' ? (
        <Alert
          action={
            state.onRetry ? (
              <Button color="inherit" onClick={state.onRetry} size="small">
                Повторити
              </Button>
            ) : undefined
          }
          severity="error"
          sx={{ borderRadius: 0 }}
        >
          {state.message}
        </Alert>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table aria-label="Таблиця товарів" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell align={column.align} key={column.id}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {state.kind === 'ready' ? (
                state.rows
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={columns.length} sx={{ py: 6 }}>
                    {state.kind === 'loading' ? (
                      <Box sx={{ alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <CircularProgress aria-label="Завантаження товарів" size={24} />
                        <Typography>{state.message ?? 'Завантаження товарів'}</Typography>
                      </Box>
                    ) : (
                      <Typography>{state.message}</Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )}
      {footer ? (
        <>
          <Divider />
          <Box sx={{ px: 3, py: 2 }}>{footer}</Box>
        </>
      ) : null}
    </Card>
  );
}
