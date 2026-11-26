import {
  seoIssueLabels,
  seoIssues,
  seoReviewKindLabels,
  seoReviewKinds,
} from '@admin/seo-review/model';
import { Chip, MenuItem, Stack, TextField } from '@mui/material';

import type { SeoIssue, SeoReviewFilter, SeoReviewKind } from '@admin/seo-review/model';

export interface SeoReviewFiltersProps {
  counts: Record<SeoIssue, number>;
  filter: SeoReviewFilter;
  kinds: readonly SeoReviewKind[];
  onChange: (filter: SeoReviewFilter) => void;
}

/** Kind picker and one chip per issue with its count; a second click on a chip clears it. */
export function SeoReviewFilters({ counts, filter, kinds, onChange }: SeoReviewFiltersProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      sx={{ alignItems: { md: 'center' } }}
    >
      <TextField
        label="Сторінки"
        onChange={(event) =>
          onChange({
            ...filter,
            kind: (event.target.value || undefined) as SeoReviewKind | undefined,
          })
        }
        select
        size="small"
        sx={{ minWidth: 180 }}
        value={filter.kind ?? ''}
      >
        <MenuItem value="">Усі</MenuItem>
        {seoReviewKinds
          .filter((kind) => kinds.includes(kind))
          .map((kind) => (
            <MenuItem key={kind} value={kind}>
              {seoReviewKindLabels[kind]}
            </MenuItem>
          ))}
      </TextField>
      <Stack aria-label="Проблеми" direction="row" role="group" sx={{ flexWrap: 'wrap', gap: 1 }}>
        {seoIssues.map((issue) => (
          <Chip
            aria-pressed={filter.issue === issue}
            color={filter.issue === issue ? 'primary' : 'default'}
            key={issue}
            label={`${seoIssueLabels[issue]} · ${counts[issue]}`}
            onClick={() =>
              onChange({ ...filter, issue: filter.issue === issue ? undefined : issue })
            }
            variant={filter.issue === issue ? 'filled' : 'outlined'}
          />
        ))}
      </Stack>
    </Stack>
  );
}
