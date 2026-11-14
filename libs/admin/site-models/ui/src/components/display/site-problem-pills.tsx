import { StatusPill } from '@admin/shared/ui';
import { isHardSiteProblem, siteProblemHint, siteProblemLabel } from '@admin/site-models/model';
import { Stack, Tooltip, Typography } from '@mui/material';

interface SiteProblemPillsProps {
  problems: readonly string[];
  /** Shown when there is no problem; nothing by default, because only problems are marked. */
  emptyText?: string;
  /** One line: the first problem and «+N» with the rest in a hint. */
  compact?: boolean;
}

/** «Чого бракує»: one pill per problem, «Немає моделі» in red as the hard error. */
export function SiteProblemPills({ compact, emptyText, problems }: SiteProblemPillsProps) {
  if (problems.length === 0)
    return emptyText ? (
      <Typography color="text.secondary" variant="body2">
        {emptyText}
      </Typography>
    ) : null;
  const shown = compact ? problems.slice(0, 1) : problems;
  const rest = problems.slice(shown.length);
  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ alignItems: 'center', flexWrap: compact ? 'nowrap' : 'wrap', gap: 0.5 }}
      useFlexGap
    >
      {shown.map((code) => (
        <Tooltip key={code} title={siteProblemHint(code) ?? ''}>
          <span>
            <StatusPill
              label={siteProblemLabel(code)}
              tone={isHardSiteProblem(code) ? 'error' : 'warning'}
            />
          </span>
        </Tooltip>
      ))}
      {rest.length > 0 ? (
        <Tooltip title={rest.map(siteProblemLabel).join(', ')}>
          <Typography color="text.secondary" sx={{ whiteSpace: 'nowrap' }} variant="caption">
            +{rest.length}
          </Typography>
        </Tooltip>
      ) : null}
    </Stack>
  );
}
