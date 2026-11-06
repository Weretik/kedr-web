import { siteQueueViewLabels, siteQueueViews } from '@admin/site-models/model';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { SiteQueueView } from '@admin/site-models/model';

interface SiteQueueViewsProps {
  value: SiteQueueView;
  counts: Record<SiteQueueView, number> | undefined;
  onChange: (view: SiteQueueView) => void;
}

/** «На перевірку · N / З проблемами · N / Без моделі · N / Усі · N»; «Без моделі» only while there are such. */
export function SiteQueueViews({ counts, onChange, value }: SiteQueueViewsProps) {
  const views = siteQueueViews.filter(
    (view) => view !== 'lone' || value === 'lone' || (counts?.lone ?? 0) > 0,
  );
  return (
    <ToggleButtonGroup
      aria-label="Що показати"
      exclusive
      onChange={(_event, next: SiteQueueView | null) => {
        if (next) onChange(next);
      }}
      size="small"
      sx={{ flexWrap: 'wrap' }}
      value={value}
    >
      {views.map((view) => (
        <ToggleButton
          key={view}
          sx={{ color: view === 'lone' ? 'error.main' : undefined, px: 1.5 }}
          value={view}
        >
          {siteQueueViewLabels[view]}
          {counts ? ` · ${counts[view]}` : ''}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
