import { StatusPill } from '@admin/shared/ui';
import { isHardSiteProblem, siteProblemHint, siteProblemLabel } from '@admin/site-models/model';
import { Stack, Tooltip, Typography } from '@mui/material';

interface SiteProblemPillsProps {
  problems: readonly string[];
  /** Shown when there is no problem; nothing by default, because only problems are marked. */
  emptyText?: string;
}

/** «Чого бракує»: one pill per problem, «Немає моделі» in red as the hard error. */
export function SiteProblemPills({ emptyText, problems }: SiteProblemPillsProps) {
  if (problems.length === 0)
    return emptyText ? (
      <Typography color="text.secondary" variant="body2">
        {emptyText}
      </Typography>
    ) : null;
  return (
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', gap: 0.5 }} useFlexGap>
      {problems.map((code) => (
        <Tooltip key={code} title={siteProblemHint(code) ?? ''}>
          <span>
            <StatusPill
              label={siteProblemLabel(code)}
              tone={isHardSiteProblem(code) ? 'error' : 'warning'}
            />
          </span>
        </Tooltip>
      ))}
    </Stack>
  );
}
