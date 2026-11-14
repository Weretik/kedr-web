import { Box } from '@mui/material';

import type { ReactNode } from 'react';

/** Latin letters 1C writes with Cyrillic look-alikes in names. */
const lookAlikes: Readonly<Record<string, string>> = {
  A: 'AА',
  B: 'BВ',
  C: 'CС',
  E: 'EЕ',
  H: 'HН',
  I: 'IІ',
  K: 'KК',
  M: 'MМ',
  O: 'OО',
  P: 'PР',
  T: 'TТ',
  X: 'XХ',
};

function codePattern(code: string): RegExp {
  const letters = [...code.trim().toUpperCase()].map((letter) => {
    const variants = lookAlikes[letter];
    return variants ? `[${variants}]` : letter.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
  });
  return new RegExp(`(?<![\\p{L}])(${letters.join('')})(?![\\p{L}])`, 'giu');
}

/** The original 1C name with the code highlighted where it stands, so a person sees what the code is part of. */
export function CodeInName({ code, name }: { code: string; name: string }) {
  if (!code.trim()) return <>{name}</>;
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of name.matchAll(codePattern(code))) {
    const start = match.index ?? 0;
    parts.push(name.slice(last, start));
    parts.push(
      <Box
        component="mark"
        key={start}
        sx={{
          bgcolor: 'warning.light',
          borderRadius: 0.5,
          color: 'text.primary',
          fontWeight: 800,
          px: 0.25,
        }}
      >
        {match[0]}
      </Box>,
    );
    last = start + match[0].length;
  }
  parts.push(name.slice(last));
  return <>{parts}</>;
}
