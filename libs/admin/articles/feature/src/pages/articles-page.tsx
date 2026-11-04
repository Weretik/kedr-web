import { useGetAdminArticlesQuery } from '@admin/articles/data-access';
import { ArticlesDataGrid } from '@admin/articles/ui';
import { useRouteNotice } from '@admin/shared/routing';
import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Button, Card, Stack, Typography } from '@mui/material';
import { useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import type { ArticleSummary } from '@admin/articles/model';

/** Site articles, newest first; drafts are marked. */
export function ArticlesPage() {
  const navigate = useNavigate();
  const query = useGetAdminArticlesQuery();
  const routeNotice = useRouteNotice();
  const open = useCallback(
    (article: ArticleSummary) => navigate(`/articles/${article.id}`),
    [navigate],
  );

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <Button
            component={RouterLink}
            startIcon={<AddOutlinedIcon />}
            to="/articles/new"
            variant="contained"
          >
            Нова стаття
          </Button>
        }
        title="Статті"
      />
      <Typography color="text.secondary" variant="body2">
        Статті розділу «Статті» на сайті, українською та російською. Чернетки на сайті не видно.
      </Typography>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <ArticlesDataGrid
          error={query.isError}
          loading={query.isFetching}
          onOpen={open}
          onRetry={() => query.refetch()}
          rows={query.data ?? []}
        />
      </Card>
      <NoticeSnackbar message={routeNotice.notice} onClose={routeNotice.close} />
    </Stack>
  );
}

export default ArticlesPage;
