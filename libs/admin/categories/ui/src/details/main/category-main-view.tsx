import { siteNameOf } from '@admin/categories/model';
import { DetailField, DetailFieldList } from '@admin/shared/ui';
import { Box } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';

interface CategoryMainViewProps {
  category: AdminCategory;
  /** Site names of the ancestors from the top down. */
  path: readonly string[];
  /** Public path before the slug, for example `/uk/catalog/`. */
  pathPrefix: string;
}

const count = (value: number | null) => (value === null ? '—' : String(value));

/** «Основне» of the category page, read-only, in four columns (spec 003 R-006). */
export function CategoryMainView({ category, path, pathPrefix }: CategoryMainViewProps) {
  return (
    <DetailFieldList columns={4}>
      <DetailField label="Назва на сайті (укр)" value={siteNameOf(category, 'uk')} />
      <DetailField label="Назва на сайті (рос)" value={siteNameOf(category, 'ru')} />
      <DetailField label="Назва в 1С" value={category.sourceName || '—'} />
      <DetailField label="ID · ключ 1С" value={`${category.id} · ${category.sourceKey}`} />
      <DetailField
        label="Повний шлях"
        value={path.length > 0 ? path.join(' › ') : 'Верхній рівень'}
      />
      <DetailField
        label="Адреса на сайті"
        value={
          <Box component="code" sx={{ fontSize: '0.8125rem' }}>
            {pathPrefix}
            {category.slug}
          </Box>
        }
      />
      <DetailField label="Товарів (з підкатегоріями)" value={count(category.productCount)} />
      <DetailField label="Моделей" value={count(category.modelCount)} />
    </DetailFieldList>
  );
}
