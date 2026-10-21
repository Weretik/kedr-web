import { useGetWorkspaceDraftsQuery, useGetWorkspaceOrdersQuery } from '@admin/orders/data-access';
import { OrderListGrid } from '@admin/orders/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Card, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { DraftDeleteDialog } from '../dialogs/draft-delete-dialog';
import { useDraftDeletion } from '../hooks/use-draft-deletion';

import type { CustomerPickerComponent } from '../orders.routes';
import type { ListQuery } from '@admin/orders/model';

interface Props { prefix: string; counterpartyId?: string; returnTo?: string; CustomerPicker?: CustomerPickerComponent; panelOnly?: boolean }
type Mode = 'orders' | 'drafts';
const number = (value: string | null, fallback: number) => { const parsed = Number(value); return Number.isInteger(parsed) && parsed >= 1 ? parsed : fallback; };
const sortOrders = new Set(['createdAt', '-createdAt', 'orderNumber', '-orderNumber', 'customerName', '-customerName', 'totalAmount', '-totalAmount']);
const sortDrafts = new Set(['updatedAt', '-updatedAt', 'title', '-title', 'customerName', '-customerName']);

export function OrderTables({ prefix, counterpartyId, returnTo, CustomerPicker, panelOnly = false }: Props) {
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const mode: Mode = params.get(`${prefix}Tab`) === 'drafts' ? 'drafts' : 'orders';
  const marker = mode === 'orders' ? 'O' : 'D';
  const read = (name: string) => params.get(`${prefix}${marker}${name}`);
  const page = number(read('Page'), 1);
  const pageSize = Math.min(100, number(read('Size'), 20));
  const searchTerm = read('Search') ?? '';
  const customer = counterpartyId ?? read('Customer') ?? '';
  const allowedSorts = mode === 'orders' ? sortOrders : sortDrafts;
  const defaultSort = mode === 'orders' ? '-createdAt' : '-updatedAt';
  const sort = allowedSorts.has(read('Sort') ?? '') ? read('Sort')! : defaultSort;
  const [searchText, setSearchText] = useState(searchTerm);
  const deletion = useDraftDeletion();
  useEffect(() => { setSearchText(searchTerm); }, [mode, searchTerm]);
  const update = (changes: Record<string, string | null>, resetPage = false) => {
    const next = new URLSearchParams(params);
    for (const [name, value] of Object.entries(changes)) {
      const key = `${prefix}${marker}${name}`;
      if (value === null || value === '') next.delete(key); else next.set(key, value);
    }
    if (resetPage) next.delete(`${prefix}${marker}Page`);
    setParams(next);
  };
  useEffect(() => {
    if (searchText === searchTerm) return;
    const timeout = window.setTimeout(() => update({ Search: searchText }, true), 300);
    return () => window.clearTimeout(timeout);
    // Search input commits after debounce; URL state remains the query source of truth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, searchTerm, mode]);
  const query: ListQuery = useMemo(() => ({
    page, pageSize, searchTerm: searchTerm || undefined, counterpartyId: customer || undefined, sort,
  }), [page, pageSize, searchTerm, customer, sort]);
  const orders = useGetWorkspaceOrdersQuery(query, { skip: mode !== 'orders' });
  const drafts = useGetWorkspaceDraftsQuery(query, { skip: mode !== 'drafts' });
  const active = mode === 'orders' ? orders : drafts;
  const back = location.pathname.startsWith('/customers/') ? `${location.pathname}${location.search}` : (returnTo ?? `${location.pathname}${location.search}`);
  const navigateTo = (target: string) => navigate(`${target}?from=${encodeURIComponent(back)}`);
  return <Stack component={panelOnly ? 'div' : 'section'} spacing={3}>
    {!panelOnly && <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between' }} spacing={2}>
      <Typography component="h1" variant="h4">Замовлення</Typography>
      <Button onClick={() => navigate('/orders/new')} startIcon={<AddIcon />} variant="contained">Створити замовлення</Button>
    </Stack>}
    <Card sx={{ overflow: 'hidden' }} variant="outlined">
      <Tabs aria-label="Списки замовлень" onChange={(_event, value: Mode) => { const next = new URLSearchParams(params); next.set(`${prefix}Tab`, value); setParams(next); }} sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, sm: 3 } }} value={mode} variant="scrollable">
        <Tab label="Замовлення" value="orders" /><Tab label="Чернетки" value="drafts" />
      </Tabs>
      <OrderListGrid
        mode={mode} rows={mode === 'orders' ? orders.data?.items ?? [] : drafts.data?.items ?? []}
        rowCount={active.data?.pageInfo.totalRecords ?? 0} loading={active.isLoading || active.isFetching}
        error={active.isError} page={page} pageSize={pageSize} search={searchText} sort={sort}
        customerFilter={!counterpartyId && CustomerPicker ? <CustomerPicker label="Клієнт" value={customer} onChange={(id) => update({ Customer: id }, true)} /> : undefined}
        onSearch={setSearchText} onPage={(next) => update({ Page: String(next) })}
        onPageSize={(next) => update({ Size: String(next) }, true)} onSort={(next) => update({ Sort: next }, true)}
        onView={(id) => navigateTo(mode === 'orders' ? `/orders/${id}` : `/orders/drafts/${id}`)}
        onEdit={mode === 'drafts' ? (id) => navigateTo(`/orders/drafts/${id}/edit`) : undefined}
        onDelete={mode === 'drafts' ? (row) => { void deletion.select(row); } : undefined}
        onRetry={() => { void active.refetch(); }}
      />
    </Card>
    {deletion.error && !deletion.selected && <Alert severity="error">{deletion.error}</Alert>}
    <DraftDeleteDialog draft={deletion.selected} error={deletion.error} deleting={deletion.deleting} onClose={deletion.close} onDelete={() => void deletion.remove()} />
  </Stack>;
}
