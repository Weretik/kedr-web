import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import { Stack, Typography } from '@mui/material';

import { CategoryManualChip } from '../components/category-manual-chip';

import type { AdminCategory } from '@admin/categories/model';

interface CategoryInformationCardProps {
  category: AdminCategory;
  /** Names from the root, including this category. */
  path: readonly string[];
}

export function CategoryInformationCard({ category, path }: CategoryInformationCardProps) {
  return (
    <SectionCard as="article" eyebrow="Категорія" title={category.nameUk} titleVariant="h5">
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography color="text.secondary" variant="body2">
          ID {category.id}
        </Typography>
        <CategoryManualChip isManual={category.isManual} />
      </Stack>
      <DetailFieldList columns={2}>
        <DetailField label="Назва російською" value={category.nameRu} />
        <DetailField label="Назва в 1С" value={category.sourceName} />
        <DetailField label="Шлях" value={path.join(' / ')} />
        <DetailField label="Рівень" value={category.level + 1} />
        <DetailField label="Ключ 1С" value={category.sourceKey} />
      </DetailFieldList>
    </SectionCard>
  );
}
