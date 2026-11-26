import { CategoryNewPanel } from '@admin/categories/ui';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

import { useNewCategory } from '../../hooks/placement/use-new-category';

import type { AdminCategory } from '@admin/categories/model';

interface NewCategoryFlowProps {
  categories: readonly AdminCategory[];
  /** The category selected in the tree; the new one goes under it unless changed. */
  selectedId: number | null;
  onCreated: (categoryId: number) => void;
}

/** «Нова категорія» in the page header and its panel (spec 002 R-001). */
export function NewCategoryFlow({ categories, onCreated, selectedId }: NewCategoryFlowProps) {
  const flow = useNewCategory(categories, onCreated);
  return (
    <>
      <Button onClick={() => flow.start(selectedId)} startIcon={<AddIcon />} variant="contained">
        Нова категорія
      </Button>
      <CategoryNewPanel
        draft={flow.draft}
        error={flow.error}
        onChange={flow.change}
        onClose={flow.close}
        onParentChange={flow.changeParent}
        onSubmit={() => void flow.submit()}
        open={flow.open}
        options={flow.options}
        saving={flow.saving}
        showErrors={flow.showErrors}
      />
    </>
  );
}
