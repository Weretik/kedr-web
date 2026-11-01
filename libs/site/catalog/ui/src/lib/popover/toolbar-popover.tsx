'use client';

import { cn } from '@site/shared/ui';
import { useCallback, useId, useRef, useState } from 'react';

import { useDismiss } from './use-dismiss';

import type { ReactNode } from 'react';

type ToolbarPopoverProps = {
  /** Accessible name and tooltip of the icon button. */
  label: string;
  icon: ReactNode;
  /** Marks a non-default choice with a dot on the button. */
  marked?: boolean;
  /** Panel content; `close` hides the panel, for example after a link is chosen. */
  children: (close: () => void) => ReactNode;
  panelClassName?: string;
};

/**
 * Icon button with a panel under it that fades and slides in. The panel stays in the DOM so the fade can run;
 * while closed it is invisible and out of the tab order. Escape or a press outside closes it.
 */
export function ToolbarPopover({
  label,
  icon,
  marked = false,
  children,
  panelClassName,
}: ToolbarPopoverProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const close = useCallback(() => setOpen(false), []);
  useDismiss(rootRef, open, close);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          'relative grid size-9 place-items-center rounded-md border border-border hover:bg-muted',
          open && 'bg-muted',
        )}
      >
        {icon}
        {marked && (
          <span aria-hidden className="absolute top-1 right-1 size-2 rounded-full bg-brand" />
        )}
      </button>
      <div
        id={panelId}
        data-open={open || undefined}
        className={cn(
          'invisible absolute top-full right-0 z-20 mt-2 -translate-y-1 rounded-xl border border-border bg-background p-3 opacity-0 shadow-lg transition duration-200 ease-out',
          'data-[open]:visible data-[open]:translate-y-0 data-[open]:opacity-100',
          panelClassName,
        )}
      >
        {children(close)}
      </div>
    </div>
  );
}
