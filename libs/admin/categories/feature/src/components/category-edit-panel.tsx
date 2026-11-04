import {
  useGetAdminCategoryQuery,
  useGetCategoryContentQuery,
} from '@admin/categories/data-access';
import { AdminEditPanel, PageLoader, SlugEditCard } from '@admin/shared/ui';
import { Alert, Button } from '@mui/material';

import { CategoryContentSection } from './category-content-section';
import { useCategoryContentEditor } from '../hooks/use-category-content-editor';
import { useCategorySlugChange } from '../hooks/use-category-slug-change';

const publicPathPrefix = '/uk/catalog/';

interface CategoryEditPanelProps {
  /** The last edited category; it stays set after closing so unsaved texts survive a reopen. */
  categoryId: number | undefined;
  open: boolean;
  onClose: () => void;
  onNotice: (message: string) => void;
}

/** Everything an administrator edits in a category: its address and the site texts per language. */
export function CategoryEditPanel({ categoryId, onClose, onNotice, open }: CategoryEditPanelProps) {
  const id = categoryId ?? 0;
  const skip = categoryId === undefined;
  const categoryQuery = useGetAdminCategoryQuery(id, { skip });
  const contentQuery = useGetCategoryContentQuery(id, { skip });
  const editor = useCategoryContentEditor(id, contentQuery.data, onNotice);
  const slugChange = useCategorySlugChange(id, onNotice);
  const category = categoryQuery.data;

  return (
    <AdminEditPanel
      busy={editor.saving || slugChange.saving}
      onClose={onClose}
      open={open && !skip}
      subtitle={category?.nameUk}
      title="Редагування категорії"
    >
      {categoryQuery.isLoading ? (
        <PageLoader label="Завантаження категорії" />
      ) : categoryQuery.isError || !category ? (
        <Alert
          action={<Button onClick={() => categoryQuery.refetch()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося завантажити категорію. Спробуйте ще раз.
        </Alert>
      ) : (
        <>
          <SlugEditCard
            currentSlug={category.slug}
            error={slugChange.error}
            onSubmit={(input) => void slugChange.submit(input)}
            pathPrefix={publicPathPrefix}
            saving={slugChange.saving}
          />
          <CategoryContentSection
            content={contentQuery.data}
            editor={editor}
            error={contentQuery.isError}
            loading={contentQuery.isLoading}
            onRetry={() => contentQuery.refetch()}
          />
        </>
      )}
    </AdminEditPanel>
  );
}
