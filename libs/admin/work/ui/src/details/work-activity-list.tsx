import {
  groupWorkActivityByDay,
  workActivityAction,
  workActivityArea,
  workActivityTarget,
  formatWorkDay,
  formatWorkTime,
} from '@admin/work/model';
import { Box, Divider, Stack, Typography } from '@mui/material';

import type { WorkActivity } from '@admin/work/model';

interface WorkActivityListProps {
  activity: readonly WorkActivity[];
  /** Text when the period has no changes. */
  emptyText: string;
  truncated?: boolean;
}

/** Admin changes by Kyiv day, newest first: time, section, what happened, which record, repeats. */
export function WorkActivityList({ activity, emptyText, truncated }: WorkActivityListProps) {
  if (activity.length === 0)
    return (
      <Typography color="text.secondary" variant="body2">
        {emptyText}
      </Typography>
    );

  return (
    <Stack spacing={2}>
      {groupWorkActivityByDay(activity).map((group) => (
        <Box key={group.day}>
          <Typography
            color="text.secondary"
            component="h3"
            sx={{ mb: 1, textTransform: 'capitalize' }}
            variant="subtitle2"
          >
            {formatWorkDay(group.day)} · {group.entries.length}
          </Typography>
          <Stack divider={<Divider flexItem />} spacing={1}>
            {group.entries.map((entry) => {
              const target = workActivityTarget(entry);
              return (
                <Stack
                  direction="row"
                  key={entry.id}
                  spacing={1.5}
                  sx={{ alignItems: 'baseline', minWidth: 0 }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}
                    variant="body2"
                  >
                    {formatWorkTime(entry.occurredAt)}
                  </Typography>
                  <Typography sx={{ minWidth: 0, overflowWrap: 'anywhere' }} variant="body2">
                    <Box component="span" sx={{ fontWeight: 600 }}>
                      {workActivityArea(entry)}
                    </Box>
                    {` — ${workActivityAction(entry)}`}
                    {target ? ` · ${target}` : ''}
                    {entry.count > 1 ? ` · збережено ${entry.count} рази` : ''}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      ))}
      {truncated ? (
        <Typography color="warning.main" variant="body2">
          Показано лише останні 2000 змін. Оберіть коротший період, щоб побачити всі.
        </Typography>
      ) : null}
    </Stack>
  );
}
