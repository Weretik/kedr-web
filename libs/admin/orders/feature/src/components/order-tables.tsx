import { useGetWorkspaceDraftsQuery, useGetWorkspaceOrdersQuery } from '@admin/orders/data-access';
import { OrderListGrid } from '@admin/orders/ui';
import { AdminPageHeader } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Card, Stack, Tab, Tabs } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { DraftDeleteDialog } from '../dialogs/draft-delete-dialog';
import { useDraftDeletion } from '../hooks/use-draft-deletion';
import { useOrderListUrlState } from '../hooks/use-order-list-url-state';

import type { Mode } from '../hooks/use-order-list-url-state';
import type { ListQuery } from '@admin/orders/model';

interface Props {
  prefix: string;
  counterpartyId?: string;
  returnTo?: string;
  panelOnly?: boolean;
}
export function OrderTables({ prefix, counterpartyId, returnTo, panelOnly = false }: Props) {
  const {
    params,
    setParams,
    mode,
    page,
    pageSize,
    searchTerm,
    createdFrom,
    createdTo,
    invalidDateRange,
    sort,
    update,
  } = useOrderListUrlState(prefix);
  const location = useLocation();
  const navigate = useNavigate();
  const customer = counterpartyId ?? '';
  const [searchText, setSearchText] = useState(searchTerm);
  const deletion = useDraftDeletion();
  useEffect(() => {
    setSearchText(searchTerm);
  }, [mode, searchTerm]);
  useEffect(() => {
    if (searchText === searchTerm) return;
    const timeout = window.setTimeout(() => update({ Search: searchText }, true), 300);
    return () => window.clearTimeout(timeout);
    // Search input commits after debounce; URL state remains the query source of truth.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, searchTerm, mode]);
  const query: ListQuery = useMemo(
    () => ({
      page,
      pageSize,
      searchTerm: panelOnly ? undefined : searchTerm || undefined,
      counterpartyId: customer || undefined,
      createdFrom: createdFrom || undefined,
      createdTo: createdTo || undefined,
      sort,
    }),
    [page, pageSize, searchTerm, customer, createdFrom, createdTo, sort, panelOnly],
  );
  const orders = useGetWorkspaceOrdersQuery(query, { skip: mode !== 'orders' || invalidDateRange });
  const drafts = useGetWorkspaceDraftsQuery(query, { skip: mode !== 'drafts' || invalidDateRange });
  const active = mode === 'orders' ? orders : drafts;
  const back = location.pathname.startsWith('/customers/')
    ? `${location.pathname}${location.search}`
    : (returnTo ?? `${location.pathname}${location.search}`);
  const navigateTo = (target: string) => navigate(`${target}?from=${encodeURIComponent(back)}`);
  return (
    <Stack component={panelOnly ? 'div' : 'section'} spacing={3}>
      {!panelOnly && (
        <AdminPageHeader
          actions={
            <Button onClick={() => navigate('/orders/new')} startIcon={<AddIcon />} variant="contained">
              Створити замовлення
            </Button>
          }
          title="Замовлення"
        />
      )}
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <Tabs
          aria-label="Списки замовлень"
          onChange={(_event, value: Mode) => {
            const next = new URLSearchParams(params);
            next.set(`${prefix}Tab`, value);
            setParams(next);
          }}
          sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, sm: 3 } }}
          value={mode}
          variant="scrollable"
        >
          <Tab label="Замовлення" value="orders" />
          <Tab label="Чернетки" value="drafts" />
        </Tabs>
        {invalidDateRange && (
          <Alert severity="error">
            Вкажіть правильний діапазон дат: початок не може бути пізніше завершення.
          </Alert>
        )}
        <OrderListGrid
          mode={mode}
          rows={mode === 'orders' ? (orders.data?.items ?? []) : (drafts.data?.items ?? [])}
          rowCount={active.data?.pageInfo.totalRecords ?? 0}
          loading={active.isLoading || active.isFetching}
          error={active.isError}
          page={page}
          pageSize={pageSize}
          search={searchText}
          sort={sort}
          createdFrom={createdFrom}
          createdTo={createdTo}
          hideSearch={panelOnly}
          hideCustomerColumn={panelOnly && mode === 'orders'}
          onSearch={setSearchText}
          onPage={(next) => update({ Page: String(next) })}
          onDateChange={(from, to) => update({ From: from, To: to }, true)}
          onPageSize={(next) => update({ Size: String(next) }, true)}
          onSort={(next) => update({ Sort: next }, true)}
          onView={(id) => navigateTo(mode === 'orders' ? `/orders/${id}` : `/orders/drafts/${id}`)}
          onEdit={mode === 'drafts' ? (id) => navigateTo(`/orders/drafts/${id}/edit`) : undefined}
          onDelete={
            mode === 'drafts'
              ? (row) => {
                  void deletion.select(row);
                }
              : undefined
          }
          onRetry={() => {
            void active.refetch();
          }}
        />
      </Card>
      {deletion.error && !deletion.selected && <Alert severity="error">{deletion.error}</Alert>}
      <DraftDeleteDialog
        draft={deletion.selected}
        error={deletion.error}
        deleting={deletion.deleting}
        onClose={deletion.close}
        onDelete={() => void deletion.remove()}
      />
    </Stack>
  );
}
