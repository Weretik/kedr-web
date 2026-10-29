import { Alert, AlertTitle, Box } from '@mui/material';
import { useEffect, useRef } from 'react';

interface Props {
  /** Blocking problems of the page; empty strings are ignored. */
  messages: (string | null | undefined | false)[];
  title?: string;
  /** Change it (for example after a failed submit) to bring the block into view. */
  revealKey?: string;
}

/**
 * Blocking problems pinned under the top bar, so they stay visible while the page scrolls,
 * including on small screens. Announced to screen readers when it appears or changes.
 */
export function PageIssues({ messages, title, revealKey }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = messages.filter((message): message is string => Boolean(message));
  useEffect(() => {
    if (revealKey) ref.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
  }, [revealKey]);
  if (shown.length === 0) return null;
  return (
    <Box
      ref={ref}
      sx={{
        position: 'sticky',
        top: 80,
        zIndex: (theme) => theme.zIndex.appBar - 1,
        scrollMarginTop: 88,
      }}
    >
      <Alert role="alert" severity="error" sx={{ boxShadow: 3 }} variant="filled">
        {title && <AlertTitle>{title}</AlertTitle>}
        {shown.length === 1 ? (
          shown[0]
        ) : (
          <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
            {shown.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </Box>
        )}
      </Alert>
    </Box>
  );
}
