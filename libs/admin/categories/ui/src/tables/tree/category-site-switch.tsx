import { Switch, Tooltip } from '@mui/material';

import type { AdminCategory } from '@admin/categories/model';

interface CategorySiteSwitchProps {
  category: AdminCategory;
  /** Administrators only: asks to show or hide; without it the switch is read-only. */
  onToggle?: (category: AdminCategory) => void;
}

/** «На сайті» in the row; the change itself waits for the confirmation dialog (spec 003 R-003). */
export function CategorySiteSwitch({ category, onToggle }: CategorySiteSwitchProps) {
  const label = category.isShownOnSite
    ? `Сховати з сайту: ${category.nameUk}`
    : `Показати на сайті: ${category.nameUk}`;
  return (
    <Tooltip title={category.isShownOnSite ? 'Показується на сайті' : 'Сховано з сайту'}>
      <span>
        <Switch
          checked={category.isShownOnSite}
          disabled={!onToggle}
          onChange={() => onToggle?.(category)}
          size="small"
          slotProps={{ input: { 'aria-label': label } }}
        />
      </span>
    </Tooltip>
  );
}
