import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import { Typography } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';

interface CategoryInformationCardProps {
  category: AdminCategory;
  /** Names from the root, including this category. */
  path: readonly string[];
}

export function CategoryInformationCard({ category, path }: CategoryInformationCardProps) {
  return (
    <SectionCard as="article" eyebrow="Категорія" title={category.nameUk} titleVariant="h5">
      <Typography color="text.secondary" variant="body2">
        ID {category.id}
      </Typography>
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
