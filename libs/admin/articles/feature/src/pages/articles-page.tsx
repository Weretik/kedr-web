import {
  useGetAdminArticlesQuery,
  useMoveLegacyArticleCoversMutation,
} from '@admin/articles/data-access';
import { ArticlesDataGrid } from '@admin/articles/ui';
import { useRouteNotice } from '@admin/shared/routing';
import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { Alert, Button, Card, Stack, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { articleCoverErrorMessage } from '../errors/article-error-message';

import type { ArticleSummary } from '@admin/articles/model';

/** Site articles, newest first; drafts are marked. */
export function ArticlesPage() {
  const navigate = useNavigate();
  const query = useGetAdminArticlesQuery();
  const routeNotice = useRouteNotice();
  const [moveLegacyCovers, moving] = useMoveLegacyArticleCoversMutation();
  const [notice, setNotice] = useState<string | null>(null);
  const [moveError, setMoveError] = useState<string | null>(null);
  const legacyCount = (query.data ?? []).filter((article) => article.hasLegacyCover).length;
  const moveCovers = async () => {
    setMoveError(null);
    try {
      const moved = await moveLegacyCovers().unwrap();
      setNotice(`Перенесено в CDN обкладинок: ${moved}.`);
    } catch (error) {
      setMoveError(articleCoverErrorMessage(error));
    }
  };
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
      {legacyCount > 0 && (
        <Alert
          action={
            <Button color="inherit" disabled={moving.isLoading} onClick={moveCovers} size="small">
              {moving.isLoading ? 'Переносимо…' : 'Перенести в CDN'}
            </Button>
          }
          severity="warning"
        >
          {`Старих обкладинок поза CDN: ${legacyCount}. Їх можна перенести в папку «Статті» медіатеки одним натиском; на сайті вони не зміняться.`}
          {moveError && (
            <Typography sx={{ mt: 0.5 }} variant="body2">
              {moveError}
            </Typography>
          )}
        </Alert>
      )}
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
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default ArticlesPage;
