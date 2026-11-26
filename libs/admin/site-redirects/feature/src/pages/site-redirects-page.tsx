import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import { useGetSiteRedirectsQuery } from '@admin/site-redirects/data-access';
import { parseSiteRedirectPageQuery, siteRedirectPageSearch } from '@admin/site-redirects/model';
import {
  DeleteSiteRedirectDialog,
  SiteRedirectPanel,
  SiteRedirectsDataGrid,
} from '@admin/site-redirects/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, Card, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSiteRedirectActions } from '../hooks/use-site-redirect-actions';

import type { SiteRedirectPageQuery } from '@admin/site-redirects/model';

/** «Переадресації»: old site addresses that answer with a 301 to a new one (spec content/013). */
export function SiteRedirectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo(() => parseSiteRedirectPageQuery(searchParams.toString()), [searchParams]);
  const list = useGetSiteRedirectsQuery(query);
  const actions = useSiteRedirectActions((id) => list.data?.items.find((item) => item.id === id));

  const setListQuery = (change: Partial<SiteRedirectPageQuery>, resetPage = false) =>
    setSearchParams(
      siteRedirectPageSearch({
        ...query,
        ...change,
        page: resetPage ? 1 : (change.page ?? query.page),
      }).slice(1),
    );

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <Button
            onClick={() => actions.open(null)}
            startIcon={<AddOutlinedIcon />}
            variant="contained"
          >
            Додати переадресацію
          </Button>
        }
        title="Переадресації"
      />
      <Typography color="text.secondary" variant="body2">
        Коли сторінка переїхала, стара адреса має вести на нову: так Google переносить її позиції, а
        люди не бачать «не знайдено». Старі регіональні сторінки /region/… вже ведуть на головну.
      </Typography>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <SiteRedirectsDataGrid
          error={list.isError}
          loading={list.isLoading || list.isFetching}
          onDelete={actions.askDelete}
          onEdit={actions.open}
          onPageChange={(page) => setListQuery({ page })}
          onPageSizeChange={(pageSize) => setListQuery({ pageSize }, true)}
          onRetry={() => void list.refetch()}
          onSearchChange={(search) => setListQuery({ search }, true)}
          page={query.page}
          pageSize={query.pageSize}
          rowCount={list.data?.totalCount ?? 0}
          rows={list.currentData?.items ?? []}
          search={query.search}
        />
      </Card>
      {actions.editing !== undefined ? (
        <SiteRedirectPanel
          error={actions.error}
          key={actions.editing?.id ?? 'new'}
          onCancel={actions.close}
          onSave={actions.save}
          redirect={actions.editing}
          saving={actions.saving}
        />
      ) : null}
      <DeleteSiteRedirectDialog
        deleting={actions.removing}
        error={actions.deleting ? actions.error : undefined}
        onCancel={actions.close}
        onConfirm={actions.confirmDelete}
        redirect={actions.deleting}
      />
      <NoticeSnackbar message={actions.notice} onClose={actions.clearNotice} />
    </Stack>
  );
}

export default SiteRedirectsPage;
