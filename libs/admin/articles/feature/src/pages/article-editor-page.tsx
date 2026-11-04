import { useDeleteArticleMutation, useGetAdminArticleQuery } from '@admin/articles/data-access';
import { ArticleCoverCard, ArticleForm, DeleteArticleDialog } from '@admin/articles/ui';
import { MediaPickerDialog } from '@admin/media/ui';
import { useRouteNotice, withNotice } from '@admin/shared/routing';
import { AdminDetailHeader, ChangedNote, NoticeSnackbar, PageLoader } from '@admin/shared/ui';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { articleErrorMessage } from '../errors/article-error-message';
import { useArticleCover } from '../hooks/use-article-cover';
import { useArticleEditor } from '../hooks/use-article-editor';

import type { Article } from '@admin/articles/model';

/** Creates an article (`/articles/new`) or edits one; the cover is chosen in the same form and saved with it. */
export function ArticleEditorPage() {
  const params = useParams();
  const navigate = useNavigate();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const routeNotice = useRouteNotice();
  const [notice, setNotice] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const isNew = params['articleId'] === 'new';
  const articleId = Number(params['articleId']);
  const validId = Number.isInteger(articleId) && articleId > 0;
  const query = useGetAdminArticleQuery(articleId, { skip: isNew || !validId });
  const [deleteArticle, deleteState] = useDeleteArticleMutation();
  const article = isNew ? undefined : query.data;
  const stored: Article | null | undefined = isNew ? null : article;

  const editor = useArticleEditor(stored, (saved, created) => {
    if (created)
      void navigate(`/articles/${saved.id}`, { replace: true, ...withNotice('Статтю створено.') });
    else setNotice('Статтю збережено.');
  });
  const cover = useArticleCover(editor.changeCover);
  const notFound = (query.error as { code?: string } | undefined)?.code === 'NotFound';

  useEffect(() => {
    headingRef.current?.focus();
  }, [articleId, isNew]);

  const confirmDelete = async () => {
    setDeleteError(undefined);
    try {
      await deleteArticle(articleId).unwrap();
      void navigate('/articles', withNotice('Статтю видалено.'));
    } catch (error) {
      setDeleteError(articleErrorMessage(error));
    }
  };

  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        actions={
          article ? (
            <Button
              color="error"
              onClick={() => setDeleteOpen(true)}
              startIcon={<DeleteOutlinedIcon />}
            >
              Видалити
            </Button>
          ) : undefined
        }
        backLabel="Назад до статей"
        backTo="/articles"
        headingRef={headingRef}
        title={isNew ? 'Нова стаття' : 'Редагування статті'}
      />
      {article ? <ChangedNote at={article.updatedAt} by={article.updatedBy} /> : null}
      {!isNew && (!validId || notFound) ? (
        <Alert severity="info">Статтю не знайдено: можливо, її вже видалено.</Alert>
      ) : !isNew && query.isLoading ? (
        <PageLoader label="Завантаження статті" />
      ) : (!isNew && (query.isError || !article)) || !editor.draft ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити статтю. Спробуйте ще раз.
        </Alert>
      ) : (
        <Box
          sx={{
            alignItems: 'start',
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 2fr) minmax(0, 1fr)' },
          }}
        >
          <ArticleForm
            dirty={editor.dirty}
            draft={editor.draft}
            errors={editor.errors}
            isNew={isNew}
            onChange={editor.change}
            onReset={editor.reset}
            onSave={() => void editor.save()}
            saveError={editor.saveError}
            saving={editor.saving}
          />
          <ArticleCoverCard
            busy={cover.busy}
            coverUrl={editor.draft.cover?.url ?? null}
            error={cover.error}
            missing={Boolean(editor.draft.cover && !editor.draft.cover.url)}
            onFileSelected={(file) => void cover.choose(file)}
            onPickFromLibrary={cover.picker.onOpen}
            onRemove={cover.clear}
          />
        </Box>
      )}
      {article ? (
        <DeleteArticleDialog
          deleting={deleteState.isLoading}
          error={deleteError}
          onCancel={() => {
            setDeleteOpen(false);
            setDeleteError(undefined);
          }}
          onConfirm={() => void confirmDelete()}
          open={deleteOpen}
          title={article.texts.uk.title}
        />
      ) : null}
      <MediaPickerDialog
        error={cover.picker.error}
        files={cover.picker.files}
        loading={cover.picker.loading}
        multiple={false}
        onCancel={cover.picker.onCancel}
        onConfirm={cover.picker.onConfirm}
        onPageChange={cover.picker.onPageChange}
        onRetry={cover.picker.onRetry}
        onSearchChange={cover.picker.onSearchChange}
        open={cover.picker.open}
        page={cover.picker.page}
        pageCount={cover.picker.pageCount}
        search={cover.picker.search}
        title="Обкладинка з медіатеки"
      />
      <NoticeSnackbar
        message={notice ?? routeNotice.notice}
        onClose={() => (notice ? setNotice(null) : routeNotice.close())}
      />
    </Stack>
  );
}

export default ArticleEditorPage;
