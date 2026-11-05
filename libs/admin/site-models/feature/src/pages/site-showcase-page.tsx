import { AdminPageHeader } from '@admin/shared/ui';
import {
  useCreateSiteModelMutation,
  useGetSiteModelCategoriesQuery,
  useGetSiteShowcaseQuery,
} from '@admin/site-models/data-access';
import { siteProductProblems } from '@admin/site-models/model';
import { SiteModelNameDialog, SiteShowcaseDataGrid } from '@admin/site-models/ui';
import { Alert, Button, Card, Stack } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProductAttributesPanel } from '../components/product-attributes-panel';
import { SiteHealthSummary } from '../components/site-health-summary';
import { SiteListFilters } from '../components/site-list-filters';
import { siteModelsErrorMessage } from '../errors/site-models-error-message';
import { useSiteQueryParams } from '../hooks/use-site-query-params';
import { readShowcaseQuery } from '../model/site-models-url-state';

import type { EditedSiteProduct } from '../components/product-attributes-panel';
import type { SiteShowcaseItem } from '@admin/site-models/model';

/** «Вітрина сайту» (spec catalog/007): every on-site product with its model, attributes, and problems. */
export function SiteShowcasePage() {
  const navigate = useNavigate();
  const params = useSiteQueryParams(readShowcaseQuery);
  const { query } = params;
  const showcase = useGetSiteShowcaseQuery(query);
  const categories = useGetSiteModelCategoriesQuery();
  const [selected, setSelected] = useState<SiteShowcaseItem[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [edited, setEdited] = useState<EditedSiteProduct>();
  const [create, createState] = useCreateSiteModelMutation();
  const { filter } = params;

  const rows = showcase.data?.items ?? [];
  const categoryIds = new Set(selected.map((item) => item.categoryId));
  const oneCategory = selected.length > 0 && categoryIds.size === 1;

  const submit = async (name: string) => {
    setCreateError(null);
    try {
      const model = await create({
        categoryId: selected[0].categoryId,
        name,
        productIds: selected.map((item) => item.productId),
      }).unwrap();
      setCreating(false);
      setSelected([]);
      navigate(`/site-models/${model.id}`);
    } catch (cause) {
      setCreateError(siteModelsErrorMessage(cause));
    }
  };

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <Button
            disabled={!oneCategory}
            onClick={() => {
              setCreateError(null);
              setCreating(true);
            }}
            variant="contained"
          >
            Створити модель з вибраних{selected.length ? ` (${selected.length})` : ''}
          </Button>
        }
        title="Вітрина сайту"
      />
      <SiteHealthSummary active={query.problem} onSelect={(problem) => filter({ problem })} />
      {selected.length > 0 && !oneCategory ? (
        <Alert severity="warning">
          Модель об’єднує товари однієї категорії: виберіть товари з однієї категорії.
        </Alert>
      ) : null}
      <SiteListFilters
        categories={categories.data ?? []}
        categoryId={query.categoryId}
        onCategory={(categoryId) => filter({ categoryId })}
        onProblem={(problem) => filter({ problem })}
        onSearch={(search) => filter({ search })}
        problem={query.problem}
        problems={siteProductProblems}
        search={query.search}
        searchLabel="Назва або код 1С"
      />
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <SiteShowcaseDataGrid
          error={showcase.isError}
          loading={showcase.isFetching}
          modelHref={(id) => `/site-models/${id}`}
          onEdit={(item) => setEdited({ productId: item.productId, name: item.name })}
          onPageChange={params.page}
          onPageSizeChange={params.pageSize}
          onRetry={() => void showcase.refetch()}
          onSelectedChange={(ids) =>
            setSelected((current) => {
              const known = new Map(
                [...current, ...rows].map((item) => [item.productId, item] as const),
              );
              return ids.flatMap((id) => known.get(id) ?? []);
            })
          }
          page={query.page}
          pageSize={query.pageSize}
          rowCount={showcase.data?.totalCount ?? 0}
          rows={rows}
          selected={selected.map((item) => item.productId)}
        />
      </Card>
      {creating ? (
        <SiteModelNameDialog
          description={`У моделі буде ${selected.length} товар(ів) з категорії «${selected[0]?.categoryName ?? ''}». Її буде прийнято одразу.`}
          error={createError}
          initialName={selected[0]?.name ?? ''}
          onCancel={() => setCreating(false)}
          onSubmit={(name) => void submit(name)}
          saving={createState.isLoading}
          submitLabel="Створити"
          title="Нова модель"
        />
      ) : null}
      <ProductAttributesPanel onClose={() => setEdited(undefined)} product={edited} />
    </Stack>
  );
}

export default SiteShowcasePage;
