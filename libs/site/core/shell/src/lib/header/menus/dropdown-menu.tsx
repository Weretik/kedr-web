import { cn } from '@site/shared/ui';
import { ChevronDownIcon } from 'lucide-react';

import type { ReactNode } from 'react';

type DropdownMenuProps = {
  label: ReactNode;
  children: ReactNode;
  triggerClassName?: string;
  panelClassName?: string;
};

/**
 * Disclosure built on `<details>`: works without JavaScript and keeps every link in the server HTML for crawlers.
 * The catalog feature replaces the catalog dropdown with a Radix navigation menu.
 */
export function DropdownMenu({
  label,
  children,
  triggerClassName,
  panelClassName,
}: DropdownMenuProps) {
  return (
    <details className="group relative">
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center gap-1.5 rounded-md text-sm font-medium select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none [&::-webkit-details-marker]:hidden',
          triggerClassName,
        )}
      >
        {label}
        <ChevronDownIcon
          className="size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
          strokeWidth={1.75}
        />
      </summary>
      <div
        className={cn(
          'absolute top-full left-0 z-40 mt-2 rounded-xl border border-border bg-background p-3 shadow-lg',
          panelClassName,
        )}
      >
        {children}
      </div>
    </details>
  );
}
