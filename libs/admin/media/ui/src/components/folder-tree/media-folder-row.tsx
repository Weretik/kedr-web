import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { Box, ButtonBase, IconButton, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';

import type { ReactNode } from 'react';

interface MediaFolderRowProps {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
  /** Part of the name to highlight: the folder search. */
  highlight?: string;
  icon?: ReactNode;
  /** `undefined` for a folder without subfolders: the row keeps the chevron space for alignment. */
  expanded?: boolean;
  onToggle?: () => void;
  /** Row actions; shown on hover, focus, or when the row is selected. */
  actions?: ReactNode;
}

function Highlighted({ text, part }: { text: string; part?: string }) {
  const needle = part?.trim().toLocaleLowerCase('uk');
  const start = needle ? text.toLocaleLowerCase('uk').indexOf(needle) : -1;
  if (!needle || start < 0) return text;
  const end = start + needle.length;
  return (
    <>
      {text.slice(0, start)}
      <Box
        component="mark"
        sx={{ bgcolor: 'warning.light', borderRadius: 0.5, color: 'inherit', px: 0.25 }}
      >
        {text.slice(start, end)}
      </Box>
      {text.slice(end)}
    </>
  );
}

/** One tree row: a single chevron, the name in up to two lines, the total count, and hidden actions. */
export function MediaFolderRow({
  actions,
  count,
  expanded,
  highlight,
  icon,
  label,
  onClick,
  onToggle,
  selected,
}: MediaFolderRowProps) {
  return (
    <Box
      sx={(theme) => ({
        alignItems: 'center',
        bgcolor: selected ? alpha(theme.palette.primary.main, 0.12) : 'transparent',
        borderRadius: 2,
        color: selected ? 'primary.main' : 'text.primary',
        display: 'grid',
        gridTemplateColumns: '24px minmax(0, 1fr) auto',
        minHeight: 36,
        pr: 0.5,
        '&:hover': { bgcolor: selected ? undefined : 'action.hover' },
        // Opacity, not visibility: the hidden button stays reachable by keyboard and screen readers.
        '& .folder-actions': { opacity: selected ? 1 : 0 },
        '&:hover .folder-actions, &:focus-within .folder-actions': { opacity: 1 },
        '@media (hover: none)': { '& .folder-actions': { opacity: 1 } },
      })}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        {expanded === undefined ? (
          icon
        ) : (
          <IconButton
            aria-expanded={expanded}
            aria-label={expanded ? `Згорнути «${label}»` : `Розгорнути «${label}»`}
            onClick={onToggle}
            size="small"
            sx={{ color: 'text.secondary', p: 0.25 }}
          >
            <ChevronRightOutlinedIcon
              fontSize="small"
              sx={{
                transform: expanded ? 'rotate(90deg)' : 'none',
                transition: (theme) => theme.transitions.create('transform', { duration: 150 }),
              }}
            />
          </IconButton>
        )}
      </Box>
      <ButtonBase
        aria-current={selected ? 'true' : undefined}
        onClick={onClick}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          columnGap: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          justifyContent: 'stretch',
          minHeight: 36,
          px: 0.75,
          py: 0.5,
          textAlign: 'left',
        }}
      >
        <Tooltip enterDelay={600} placement="right" title={label}>
          <Box
            component="span"
            sx={{
              display: '-webkit-box',
              fontWeight: selected ? 600 : 400,
              lineHeight: 1.3,
              overflow: 'hidden',
              overflowWrap: 'anywhere',
              typography: 'body2',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            <Highlighted part={highlight} text={label} />
          </Box>
        </Tooltip>
        <Box
          component="span"
          sx={{
            color: selected ? 'primary.main' : 'text.secondary',
            fontVariantNumeric: 'tabular-nums',
            typography: 'caption',
          }}
        >
          {count}
        </Box>
      </ButtonBase>
      <Box className="folder-actions" sx={{ display: 'flex', minWidth: actions ? 28 : 0 }}>
        {actions}
      </Box>
    </Box>
  );
}
