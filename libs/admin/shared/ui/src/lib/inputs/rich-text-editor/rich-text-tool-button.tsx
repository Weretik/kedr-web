import { ToggleButton, Tooltip } from '@mui/material';

import type { ReactNode } from 'react';

interface ToolButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

/** A toolbar toggle with a tooltip; keeps the editor selection on click. */
export function ToolButton({
  active = false,
  children,
  disabled = false,
  label,
  onClick,
}: ToolButtonProps) {
  return (
    <Tooltip title={label}>
      <span>
        <ToggleButton
          aria-label={label}
          disabled={disabled}
          onChange={onClick}
          // Keeps the text selection in the editor while the button is pressed.
          onMouseDown={(event) => event.preventDefault()}
          selected={active}
          size="small"
          sx={{ border: 0, fontWeight: 700, minWidth: 36 }}
          value={label}
        >
          {children}
        </ToggleButton>
      </span>
    </Tooltip>
  );
}
