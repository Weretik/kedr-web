import Link from 'next/link';

import type { ReactNode } from 'react';

type HomeSectionProps = {
  id: string;
  title: string;
  /** Optional «see all» link next to the heading. */
  action?: { href: string; label: string };
  children: ReactNode;
};

/** A titled home block; the H2 labels the section for assistive technology. */
export function HomeSection({ id, title, action, children }: HomeSectionProps) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <h2 id={id} className="text-2xl font-semibold tracking-tight">
          {title}
        </h2>
        {action && (
          <Link href={action.href} className="text-sm font-medium text-brand-text hover:underline">
            {action.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
