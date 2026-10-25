import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useId } from 'react';

import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title: ReactNode;
  children: ReactNode;
  /** Small uppercase label above the title. */
  eyebrow?: string;
  /** Element for the card: a landmark `section` (default) or an `article` for the main entity. */
  as?: 'article' | 'section';
  /** `h5` for the main entity name, `h6` for a section. */
  titleVariant?: 'h5' | 'h6';
  action?: ReactNode;
  sx?: SxProps<Theme>;
}

/** Card with a labelled heading: the standard block of a detail page. */
export function SectionCard({
  action,
  as = 'section',
  children,
  eyebrow,
  sx,
  title,
  titleVariant = 'h6',
}: SectionCardProps) {
  const titleId = useId();

  return (
    <Card
      aria-labelledby={titleId}
      component={as}
      sx={[{ minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]}
      variant="outlined"
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              {eyebrow ? (
                <Typography color="text.secondary" component="p" variant="overline">
                  {eyebrow}
                </Typography>
              ) : null}
              <Typography
                component="h2"
                id={titleId}
                sx={{ overflowWrap: 'anywhere' }}
                variant={titleVariant}
              >
                {title}
              </Typography>
            </Stack>
            {action}
          </Stack>
          {children}
        </Stack>
      </CardContent>
    </Card>
  );
}
