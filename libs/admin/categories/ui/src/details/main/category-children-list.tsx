import { siteNameOf } from '@admin/categories/model';
import { Link, List, ListItem, ListItemText, Typography } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';

/** «Підкатегорії» of a parent category: links to their pages (spec 003 R-008). */
export function CategoryChildrenList({ categories }: { categories: readonly AdminCategory[] }) {
  if (categories.length === 0)
    return (
      <Typography color="text.secondary" variant="body2">
        Підкатегорій немає.
      </Typography>
    );
  return (
    <List dense disablePadding>
      {categories.map((child) => (
        <ListItem disableGutters key={child.id}>
          <ListItemText
            primary={<Link href={`/categories/${child.id}`}>{siteNameOf(child)}</Link>}
            secondary={`Товарів: ${child.productCount ?? '—'} · Моделей: ${child.modelCount ?? '—'}`}
          />
        </ListItem>
      ))}
    </List>
  );
}
