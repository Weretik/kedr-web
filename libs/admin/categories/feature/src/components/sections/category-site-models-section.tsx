import { CategoryAddModelsDialog, CategorySiteModelsCard } from '@admin/categories/ui';

import { useCategorySiteModels } from '../../hooks/placement/use-category-site-models';

import type { AdminCategory } from '@admin/categories/model';

interface CategorySiteModelsSectionProps {
  category: AdminCategory;
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/** «Моделі» tab of a final category, with «Додати моделі» in a dialog for editors (spec 002 R-006, spec 003 R-012). */
export function CategorySiteModelsSection({
  canEdit,
  category,
  onNotice,
}: CategorySiteModelsSectionProps) {
  const section = useCategorySiteModels(category, onNotice);
  const { panel } = section;
  return (
    <>
      <CategorySiteModelsCard
        error={section.error}
        loading={section.loading}
        models={section.models}
        onAdd={canEdit ? section.start : undefined}
        onRetry={section.retry}
      />
      {canEdit ? (
        <CategoryAddModelsDialog
          categoryName={category.nameUk}
          error={panel.error}
          loading={panel.loading}
          models={panel.models}
          onClose={section.close}
          onSearchChange={section.setSearch}
          onSubmit={() => void section.submit()}
          onToggle={section.toggle}
          open={panel.open}
          presentIds={panel.presentIds}
          saving={panel.saving}
          search={panel.search}
          selectedIds={panel.selectedIds}
        />
      ) : null}
    </>
  );
}
