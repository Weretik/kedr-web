import { CategorySearchForm, CategorySearchView } from '@admin/categories/ui';
import { MediaPickerDialog } from '@admin/media/ui';
import { SectionCard } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Button } from '@mui/material';
import { useState } from 'react';

import { useCategorySearchSettings } from '../../hooks/editing/use-category-search-settings';

import type { AdminCategory } from '@admin/categories/model';

interface CategorySearchSectionProps {
  category: AdminCategory;
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/** «Пошук і поширення»: read-only, «Редагувати» turns it into the form (spec 003 R-010, spec 011). */
export function CategorySearchSection({ canEdit, category, onNotice }: CategorySearchSectionProps) {
  const [editing, setEditing] = useState(false);
  const search = useCategorySearchSettings(category, (message) => {
    onNotice(message);
    setEditing(false);
  });
  const { picker } = search;

  return (
    <SectionCard
      action={
        canEdit && !editing ? (
          <Button
            onClick={() => setEditing(true)}
            startIcon={<EditOutlinedIcon />}
            variant="outlined"
          >
            Редагувати
          </Button>
        ) : undefined
      }
      title="Пошук і поширення"
    >
      {editing ? (
        <>
          <CategorySearchForm
            dirty={search.dirty}
            error={search.error}
            isClosedFromSearch={search.draft.isClosedFromSearch}
            onClosedChange={search.setClosed}
            onPickPicture={picker.onOpen}
            onRemovePicture={search.removePicture}
            onReset={() => {
              search.reset();
              setEditing(false);
            }}
            onSave={() => void search.submit()}
            picture={search.draft.picture}
            saving={search.saving}
          />
          <MediaPickerDialog
            error={picker.error}
            files={picker.files}
            loading={picker.loading}
            multiple={false}
            onCancel={picker.onCancel}
            onConfirm={picker.onConfirm}
            onPageChange={picker.onPageChange}
            onRetry={picker.onRetry}
            onSearchChange={picker.onSearchChange}
            open={picker.open}
            page={picker.page}
            pageCount={picker.pageCount}
            search={picker.search}
            title="Фото для поширення з медіатеки"
          />
        </>
      ) : (
        <CategorySearchView
          isClosedFromSearch={category.isClosedFromSearch}
          picture={category.sharePicture}
        />
      )}
    </SectionCard>
  );
}
