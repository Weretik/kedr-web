import { AdminPageHeader } from '@admin/shared/ui';
import {
  useGetSiteModelCategoriesQuery,
  useGetSiteShowcaseQuery,
} from '@admin/site-models/data-access';
import { siteProductProblems } from '@admin/site-models/model';
import { SiteModelCategoriesNav, SiteShowcaseDataGrid } from '@admin/site-models/ui';
import { Box, Card, Stack } from '@mui/material';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ProductAttributesPanel } from '../components/product-attributes-panel';
import { SiteHealthSummary } from '../components/site-health-summary';
import { SiteListFilters } from '../components/site-list-filters';
import { useSiteQueryParams } from '../hooks/use-site-query-params';
import { siteListReturnState } from '../model/site-list-return';
import { readShowcaseQuery } from '../model/site-models-url-state';

import type { EditedSiteProduct } from '../components/product-attributes-panel';

/**
 * «Вітрина сайту» (spec catalog/007): what goes to the site, one row per model; the arrow shows its products with
 * their attributes and problems.
 */
export function SiteShowcasePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useSiteQueryParams(readShowcaseQuery);
  const { filter, query } = params;
  const showcase = useGetSiteShowcaseQuery(query);
  const categories = useGetSiteModelCategoriesQuery();
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
  const [edited, setEdited] = useState<EditedSiteProduct>();

  const toggle = (key: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (!next.delete(key)) next.add(key);
      return next;
    });

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Вітрина сайту" />
      <SiteHealthSummary active={query.problem} onSelect={(problem) => filter({ problem })} />
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: '280px minmax(0, 1fr)' },
          alignItems: 'start',
        }}
      >
        <SiteModelCategoriesNav
          categories={categories.data ?? []}
          count="products"
          loading={categories.isLoading}
          onSelect={(categoryId) => filter({ categoryId })}
          selectedId={query.categoryId}
        />
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <SiteListFilters
            onProblem={(problem) => filter({ problem })}
            onSearch={(search) => filter({ search })}
            problem={query.problem}
            problems={siteProductProblems}
            search={query.search}
            searchLabel="Модель, товар або код 1С"
          />
          <Card sx={{ overflow: 'hidden' }} variant="outlined">
            <SiteShowcaseDataGrid
              error={showcase.isError}
              expanded={expanded}
              loading={showcase.isFetching}
              onEdit={(item) => setEdited({ productId: item.productId, name: item.name })}
              onOpenModel={(id) =>
                navigate(`/site-models/${id}`, {
                  state: siteListReturnState(location.pathname, location.search),
                })
              }
              onPageChange={params.page}
              onPageSizeChange={params.pageSize}
              onRetry={() => void showcase.refetch()}
              onToggle={toggle}
              page={query.page}
              pageSize={query.pageSize}
              rowCount={showcase.data?.totalCount ?? 0}
              rows={showcase.data?.items ?? []}
            />
          </Card>
        </Stack>
      </Box>
      <ProductAttributesPanel onClose={() => setEdited(undefined)} product={edited} />
    </Stack>
  );
}

export default SiteShowcasePage;
