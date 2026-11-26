import { SectionCard } from '@admin/shared/ui';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Button, Stack } from '@mui/material';

import type { CategoryProblem, CategoryProblemTab } from '@admin/categories/model';

interface CategoryProblemsCardProps {
  problems: readonly CategoryProblem[];
  /** Opens the tab where the problem is fixed. */
  onOpenTab: (tab: CategoryProblemTab) => void;
}

/** «Що бракує» on the category page; nothing at all when the category is complete (spec 003 R-007). */
export function CategoryProblemsCard({ onOpenTab, problems }: CategoryProblemsCardProps) {
  if (problems.length === 0) return null;
  return (
    <SectionCard title="Що бракує">
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
        {problems.map((problem) => (
          <Button
            color="warning"
            key={problem.key}
            onClick={() => onOpenTab(problem.tab)}
            startIcon={<ErrorOutlineIcon />}
            variant="outlined"
          >
            {problem.label}
          </Button>
        ))}
      </Stack>
    </SectionCard>
  );
}
