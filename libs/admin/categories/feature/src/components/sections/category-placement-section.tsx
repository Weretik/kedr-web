import { CategoryPlaceView } from '@admin/categories/ui';
import { SectionCard } from '@admin/shared/ui';
import OpenWithIcon from '@mui/icons-material/OpenWith';
import { Button } from '@mui/material';

import type { useCategoryPlacement } from '../../hooks/placement/use-category-placement';

interface CategoryPlacementSectionProps {
  path: readonly string[];
  placement: ReturnType<typeof useCategoryPlacement>;
  canEdit: boolean;
}

/** «Розташування»: where the category sits, «Вище» / «Нижче» and «Перемістити» (spec 003 R-011). */
export function CategoryPlacementSection({
  canEdit,
  path,
  placement,
}: CategoryPlacementSectionProps) {
  return (
    <SectionCard
      action={
        canEdit ? (
          <Button onClick={placement.startMove} startIcon={<OpenWithIcon />} variant="outlined">
            Перемістити
          </Button>
        ) : undefined
      }
      title="Розташування"
    >
      <CategoryPlaceView
        busy={placement.busy}
        canMoveDown={placement.canMoveDown}
        canMoveUp={placement.canMoveUp}
        error={placement.dialogOpen ? undefined : placement.error}
        onMove={canEdit ? (direction) => void placement.move(direction) : undefined}
        path={path}
        position={placement.position}
      />
    </SectionCard>
  );
}
