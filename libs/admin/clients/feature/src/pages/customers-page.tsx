import { useGetCustomersPageQuery } from '@admin/clients/data-access';
import { customerPageSearch, parseCustomerPageQuery } from '@admin/clients/model';
import { CustomersDataGrid } from '@admin/clients/ui';
import { Card, Stack, Typography } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { CustomerPageQuery, CustomerSort } from '@admin/clients/model';

export function CustomersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => parseCustomerPageQuery(searchParams.toString()), [searchParams]);
  const customersQuery = useGetCustomersPageQuery(query);
  const rowCountReference = useRef(0);
  const headingReference = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingReference.current?.focus();
  }, []);
  if (customersQuery.currentData) {
    rowCountReference.current = customersQuery.currentData.totalRecords;
  }

  const setListQuery = (change: Partial<CustomerPageQuery>, resetPage = false) => {
    if (resetPage) rowCountReference.current = 0;
    setSearchParams(
      customerPageSearch({
        ...query,
        ...change,
        page: resetPage ? 1 : (change.page ?? query.page),
      }).slice(1),
    );
  };

  return (
    <Stack component="section" spacing={3}>
      <Typography component="h1" ref={headingReference} tabIndex={-1} variant="h4">
        Клієнти
      </Typography>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <CustomersDataGrid
          error={customersQuery.isError}
          loading={customersQuery.isLoading || customersQuery.isFetching}
          onPageChange={(page) => setListQuery({ page })}
          onPageSizeChange={(pageSize) => setListQuery({ pageSize }, true)}
          onRetry={() => void customersQuery.refetch()}
          onSearchChange={(searchTerm) => setListQuery({ searchTerm }, true)}
          onSortChange={(sort: CustomerSort) => setListQuery({ sort }, true)}
          onView={(counterpartyId) =>
            navigate(`/customers/${encodeURIComponent(counterpartyId)}${customerPageSearch(query)}`)
          }
          page={query.page}
          pageSize={query.pageSize}
          rowCount={rowCountReference.current}
          rows={customersQuery.currentData?.items ?? []}
          searchTerm={query.searchTerm}
          sort={query.sort ?? 'name'}
        />
      </Card>
    </Stack>
  );
}

export default CustomersPage;
