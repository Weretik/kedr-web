import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import {
  useAcceptSiteModelsMutation,
  useCreateSiteModelMutation,
  useGetSiteModelCategoriesQuery,
  useGetSiteModelHealthQuery,
  useGetSiteModelsQuery,
} from '@admin/site-models/data-access';
import { siteModelProblems } from '@admin/site-models/model';
import {
  SiteModelCategoriesNav,
  SiteModelNameDialog,
  SiteModelsDataGrid,
  SiteModelsHelpDialog,
} from '@admin/site-models/ui';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { Alert, Box, Button, Card, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SiteListFilters } from '../components/site-list-filters';
import { siteModelsErrorMessage } from '../errors/site-models-error-message';
import { useSiteQueryParams } from '../hooks/use-site-query-params';
import { readModelsQuery } from '../model/site-models-url-state';

import type { SiteModelStatus } from '@admin/site-models/model';

/** «Моделі» (spec catalog/007): the site pages of products, by category; proposals are accepted here. */
export function SiteModelsPage() {
  const navigate = useNavigate();
  const params = useSiteQueryParams(readModelsQuery);
  const { filter, query } = params;
  const models = useGetSiteModelsQuery(query);
  const categories = useGetSiteModelCategoriesQuery();
  const health = useGetSiteModelHealthQuery();
  const [accept, acceptState] = useAcceptSiteModelsMutation();
  const [create, createState] = useCreateSiteModelMutation();
  const [selected, setSelected] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [help, setHelp] = useState(false);
  const [creating, setCreating] = useState(false);
  const category = categories.data?.find((item) => item.id === query.categoryId);
  const proposed = health.data?.proposedModels ?? 0;

  const acceptSelected = async () => {
    setError(null);
    try {
      await accept(selected).unwrap();
      setNotice(`Прийнято моделей: ${selected.length}`);
      setSelected([]);
    } catch (cause) {
      setError(siteModelsErrorMessage(cause));
    }
  };

  const createModel = async (name: string) => {
    if (!category) return;
    setError(null);
    try {
      const model = await create({ categoryId: category.id, name, productIds: [] }).unwrap();
      setCreating(false);
      navigate(`/site-models/${model.id}`);
    } catch (cause) {
      setError(siteModelsErrorMessage(cause));
    }
  };

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <>
            <Button onClick={() => setHelp(true)} startIcon={<HelpOutlineOutlinedIcon />}>
              Як це працює
            </Button>
            <Button
              disabled={!category}
              onClick={() => {
                setError(null);
                setCreating(true);
              }}
              startIcon={<AddIcon />}
              title={category ? undefined : 'Спершу виберіть категорію'}
              variant="contained"
            >
              Нова модель
            </Button>
          </>
        }
        title="Моделі"
      />
      {proposed > 0 && query.status !== 'proposed' ? (
        <Alert
          action={
            <Button onClick={() => filter({ status: 'proposed' })} size="small">
              Переглянути
            </Button>
          }
          severity="info"
        >
          Запропоновано моделей: {proposed}. Перегляньте їх і прийміть, щоб товари отримали свої
          сторінки.
        </Alert>
      ) : null}
      {error && !creating ? <Alert severity="error">{error}</Alert> : null}
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
          loading={categories.isLoading}
          onSelect={(categoryId) => filter({ categoryId })}
          selectedId={query.categoryId}
        />
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <Tabs
            aria-label="Стан моделей"
            onChange={(_event, value: SiteModelStatus | 'all') =>
              filter({ status: value === 'all' ? undefined : value })
            }
            value={query.status ?? 'all'}
          >
            <Tab label="Усі" value="all" />
            <Tab label="Прийняті" value="accepted" />
            <Tab label="Запропоновані" value="proposed" />
          </Tabs>
          <SiteListFilters
            onProblem={(problem) => filter({ problem })}
            onSearch={(search) => filter({ search })}
            problem={query.problem}
            problems={siteModelProblems}
            search={query.search}
            searchLabel="Модель, товар або код 1С"
          />
          {selected.length > 0 ? (
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Button
                disabled={acceptState.isLoading}
                onClick={() => void acceptSelected()}
                variant="contained"
              >
                Прийняти вибрані ({selected.length})
              </Button>
              <Button onClick={() => setSelected([])}>Зняти вибір</Button>
            </Stack>
          ) : null}
          <Card sx={{ overflow: 'hidden' }} variant="outlined">
            <SiteModelsDataGrid
              error={models.isError}
              loading={models.isFetching}
              onOpen={(model) => navigate(`/site-models/${model.id}`)}
              onPageChange={params.page}
              onPageSizeChange={params.pageSize}
              onRetry={() => void models.refetch()}
              onSelectedChange={setSelected}
              page={query.page}
              pageSize={query.pageSize}
              rowCount={models.data?.totalCount ?? 0}
              rows={models.data?.items ?? []}
              selected={selected}
            />
          </Card>
        </Stack>
      </Box>
      {help ? <SiteModelsHelpDialog onClose={() => setHelp(false)} /> : null}
      {creating && category ? (
        <SiteModelNameDialog
          description={`Порожня модель у категорії «${category.name}». Товари додасте на її сторінці.`}
          error={error}
          initialName=""
          onCancel={() => setCreating(false)}
          onSubmit={(name) => void createModel(name)}
          saving={createState.isLoading}
          submitLabel="Створити"
          title="Нова модель"
        />
      ) : null}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default SiteModelsPage;
