import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { ArticlePublicationFilter } from '@admin/articles/model';

const options: { value: ArticlePublicationFilter; label: string }[] = [
  { value: 'all', label: 'Усі' },
  { value: 'published', label: 'Опубліковані' },
  { value: 'draft', label: 'Чернетки' },
];

interface ArticlePublicationToggleProps {
  value: ArticlePublicationFilter;
  onChange: (value: ArticlePublicationFilter) => void;
}

/** Switches the article list between all articles, those on the site, and drafts. */
export function ArticlePublicationToggle({ onChange, value }: ArticlePublicationToggleProps) {
  return (
    <ToggleButtonGroup
      aria-label="Показати статті"
      exclusive
      onChange={(_event, next: ArticlePublicationFilter | null) => next && onChange(next)}
      size="small"
      value={value}
    >
      {options.map((option) => (
        <ToggleButton key={option.value} value={option.value}>
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
