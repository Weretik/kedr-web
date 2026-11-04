'use client';

import { cn } from '@site/shared/ui';
import { ChevronDownIcon } from 'lucide-react';
import { useId, useState } from 'react';

type CategoryTextProps = {
  html: string;
  /** Long text starts folded to a few lines; the whole text is still in the HTML. */
  collapsible: boolean;
  moreLabel: string;
  lessLabel: string;
};

const PROSE =
  'text-sm leading-relaxed text-foreground/85 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2:first-child]:mt-0 [&_h3]:mt-4 [&_h3]:mb-1.5 [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-5 [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:mb-3 [&_ul]:list-disc';

/** Admin-written category text (sanitized by the backend); a long one folds with a fade and a toggle. */
export function CategoryText({ collapsible, html, lessLabel, moreLabel }: CategoryTextProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const folded = collapsible && !open;

  return (
    <div className="min-w-0">
      <div
        id={id}
        className={cn(
          PROSE,
          folded &&
            'max-h-56 overflow-hidden [mask-image:linear-gradient(to_bottom,black_60%,transparent)]',
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {collapsible && (
        <button
          type="button"
          aria-controls={id}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-md text-sm font-semibold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {open ? lessLabel : moreLabel}
          <ChevronDownIcon
            aria-hidden
            size={16}
            className={cn(
              'transition-transform motion-reduce:transition-none',
              open && 'rotate-180',
            )}
          />
        </button>
      )}
    </div>
  );
}
