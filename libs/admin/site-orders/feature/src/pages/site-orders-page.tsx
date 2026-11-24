import { AdminPageHeader } from '@admin/shared/ui';
import { useGetSiteOrdersPageQuery } from '@admin/site-orders/data-access';
import { parseSiteOrderPageQuery, siteOrderPageSearch } from '@admin/site-orders/model';
import { SiteOrdersDataGrid } from '@admin/site-orders/ui';
import { Card, Stack } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import type { SiteOrderPageQuery } from '@admin/site-orders/model';

/** «Замовлення з сайту»: every order buyers sent from the site, newest first (spec R-002). */
export function SiteOrdersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => parseSiteOrderPageQuery(searchParams.toString()), [searchParams]);
  // `data` keeps the last page while the next one loads, so the pager does not jump back to 0 rows.
  const ordersQuery = useGetSiteOrdersPageQuery(query);
  const headingReference = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingReference.current?.focus();
  }, []);

  const setListQuery = (change: Partial<SiteOrderPageQuery>, resetPage = false) => {
    setSearchParams(
      siteOrderPageSearch({
        ...query,
        ...change,
        page: resetPage ? 1 : (change.page ?? query.page),
      }).slice(1),
    );
  };

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader headingRef={headingReference} title="Замовлення з сайту" />
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <SiteOrdersDataGrid
          error={ordersQuery.isError}
          loading={ordersQuery.isLoading || ordersQuery.isFetching}
          onPageChange={(page) => setListQuery({ page })}
          onPageSizeChange={(pageSize) => setListQuery({ pageSize }, true)}
          onProblemOnlyChange={(problemOnly) => setListQuery({ problemOnly }, true)}
          onRetry={() => void ordersQuery.refetch()}
          onSearchChange={(search) => setListQuery({ search }, true)}
          onView={(orderId) => navigate(`/site-orders/${orderId}${siteOrderPageSearch(query)}`)}
          page={query.page}
          pageSize={query.pageSize}
          problemOnly={query.problemOnly ?? false}
          rowCount={ordersQuery.data?.totalRecords ?? 0}
          rows={ordersQuery.currentData?.items ?? []}
          search={query.search}
        />
      </Card>
    </Stack>
  );
}

export default SiteOrdersPage;
