import { Breadcrumbs, Link, Typography } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';

interface CategoryBreadcrumbsProps {
  category: AdminCategory;
  /** Categories from the root down to the parent; nothing is shown for a root category. */
  ancestors: readonly AdminCategory[];
  onSelect: (categoryId: number) => void;
}

/** The path to the category; each parent opens on click. */
export function CategoryBreadcrumbs({ ancestors, category, onSelect }: CategoryBreadcrumbsProps) {
  if (ancestors.length === 0) return null;
  return (
    <Breadcrumbs aria-label="Шлях категорії" sx={{ mt: -1 }}>
      {ancestors.map((ancestor) => (
        <Link
          component="button"
          key={ancestor.id}
          onClick={() => onSelect(ancestor.id)}
          type="button"
          underline="hover"
          variant="body2"
        >
          {ancestor.nameUk}
        </Link>
      ))}
      <Typography color="text.primary" variant="body2">
        {category.nameUk}
      </Typography>
    </Breadcrumbs>
  );
}
