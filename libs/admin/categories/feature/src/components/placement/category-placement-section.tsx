import { useGetAdminCategoriesQuery } from '@admin/categories/data-access';
import { CategoryDeleteDialog, CategoryPlaceCard } from '@admin/categories/ui';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Box, Button } from '@mui/material';

import { useCategoryDelete } from '../../hooks/placement/use-category-delete';
import { useCategoryPlacement } from '../../hooks/placement/use-category-placement';

import type { AdminCategory } from '@admin/categories/model';

interface CategoryPlacementSectionProps {
  category: AdminCategory;
  onNotice: (message: string) => void;
  /** After a manual category is deleted: where to go (its parent, or `null` for the top). */
  onDeleted: (parentId: number | null) => void;
}

/** «Розташування» of any category and «Видалити» of a manual one, in its edit panel (spec 002 R-003, R-004). */
export function CategoryPlacementSection({
  category,
  onDeleted,
  onNotice,
}: CategoryPlacementSectionProps) {
  const listQuery = useGetAdminCategoriesQuery({ deleted: false });
  const placement = useCategoryPlacement(category, listQuery.data ?? [], onNotice);
  const removal = useCategoryDelete(category, (parentId) => {
    onNotice('Категорію видалено.');
    onDeleted(parentId);
  });

  return (
    <>
      <CategoryPlaceCard
        busy={placement.busy || listQuery.isLoading}
        canMoveDown={placement.canMoveDown}
        canMoveUp={placement.canMoveUp}
        dirty={placement.dirty}
        draft={placement.draft}
        error={placement.error}
        onDraftChange={placement.setDraft}
        onMove={(direction) => void placement.move(direction)}
        onSave={() => void placement.save()}
        options={placement.options}
      />
      {removal.canDelete ? (
        <Box>
          <Button
            color="error"
            onClick={removal.ask}
            startIcon={<DeleteOutlinedIcon />}
            variant="outlined"
          >
            Видалити
          </Button>
        </Box>
      ) : null}
      {removal.open ? (
        <CategoryDeleteDialog
          deleting={removal.deleting}
          error={removal.error}
          name={category.nameUk}
          onCancel={removal.cancel}
          onConfirm={() => void removal.confirm()}
        />
      ) : null}
    </>
  );
}
