import { cn } from '@site/shared/ui';
import Link from 'next/link';

import type { ReactNode } from 'react';

/** A filter flag submitted as `name=true`, like the listing URL expects. */
export function Flag({ name, label, checked }: { name: string; label: string; checked: boolean }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={checked}
        className="size-4 accent-[var(--brand)]"
      />
      {label}
    </label>
  );
}

/** A whole-hryvnia price bound; an empty field means no bound. */
export function PriceInput({
  name,
  label,
  value,
}: {
  name: string;
  label: string;
  value: number | null;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="sr-only">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        name={name}
        placeholder={label}
        defaultValue={value ?? ''}
        className="h-9 w-24 rounded-md border border-border bg-background px-2 tabular-nums"
      />
    </label>
  );
}

/** Grid or table switch; a link, because the view is part of the URL but not of the index. */
export function ViewLink({
  href,
  active,
  label,
  children,
}: {
  href: string;
  active: boolean;
  label: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      rel="nofollow"
      aria-label={label}
      aria-current={active ? 'true' : undefined}
      title={label}
      className={cn(
        'grid size-8 place-items-center rounded',
        active ? 'bg-muted' : 'hover:bg-muted/60',
      )}
    >
      {children}
    </Link>
  );
}
