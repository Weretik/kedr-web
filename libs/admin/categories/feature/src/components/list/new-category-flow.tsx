import { CategoryNewDialog } from '@admin/categories/ui';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

import { useNewCategory } from '../../hooks/placement/use-new-category';

import type { AdminCategory } from '@admin/categories/model';

interface NewCategoryFlowProps {
  categories: readonly AdminCategory[];
  onCreated: (categoryId: number) => void;
}

/** «Нова категорія» in the page header and its dialog (spec 002 R-001, spec 003 R-012). */
export function NewCategoryFlow({ categories, onCreated }: NewCategoryFlowProps) {
  const flow = useNewCategory(categories, onCreated);
  return (
    <>
      <Button onClick={() => flow.start(null)} startIcon={<AddIcon />} variant="contained">
        Нова категорія
      </Button>
      <CategoryNewDialog
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
