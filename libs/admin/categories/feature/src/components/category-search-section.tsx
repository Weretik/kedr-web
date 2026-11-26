import { CategorySearchForm, CategorySiteNamesForm } from '@admin/categories/ui';
import { MediaPickerDialog } from '@admin/media/ui';

import { useCategorySearchSettings } from '../hooks/use-category-search-settings';
import { useCategorySiteNames } from '../hooks/use-category-site-names';

import type { AdminCategory } from '@admin/categories/model';

interface CategorySearchSectionProps {
  category: AdminCategory;
  onNotice: (message: string) => void;
}

/** The site names, «Закрити від пошуку», and the link-preview picture of a category in its edit panel. */
export function CategorySearchSection({ category, onNotice }: CategorySearchSectionProps) {
  const names = useCategorySiteNames(category, onNotice);
  const search = useCategorySearchSettings(category, onNotice);
  const { picker } = search;

  return (
    <>
      <CategorySiteNamesForm
        dirty={names.dirty}
        error={names.error}
        onChange={names.change}
        onReset={names.reset}
        onSave={() => void names.submit()}
        saving={names.saving}
        sourceName={category.sourceName}
        value={names.draft}
      />
      <CategorySearchForm
        dirty={search.dirty}
        error={search.error}
        isClosedFromSearch={search.draft.isClosedFromSearch}
        onClosedChange={search.setClosed}
        onPickPicture={picker.onOpen}
        onRemovePicture={search.removePicture}
        onReset={search.reset}
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
  );
}
