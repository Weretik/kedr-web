import { StatusPill } from '@admin/shared/ui';
import { Stack } from '@mui/material';

import type { CategoryProblem } from '@admin/categories/model';

/** «Чого бракує» of a category: only problems, nothing when all is in place (spec 003 R-004). */
export function CategoryProblemPills({ problems }: { problems: readonly CategoryProblem[] }) {
  if (problems.length === 0) return null;
  return (
    <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5, py: 1 }}>
      {problems.map((problem) => (
        <StatusPill key={problem.key} label={problem.label} tone="warning" />
      ))}
    </Stack>
  );
}
