'use client';

import { useEffect, useRef } from 'react';

import type { ReactNode } from 'react';

/**
 * Scrolls the results heading into view when a new search lands, so the visitor sees that the search ran.
 * Re-mount it with a `key` per term; it respects `prefers-reduced-motion`.
 */
export function ResultsAnchor({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    ref.current?.scrollIntoView?.({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  }, []);

  return (
    // The sticky header covers the top of the viewport; the margin keeps the heading below it.
    <h2 ref={ref} tabIndex={-1} className="scroll-mt-44 text-lg font-semibold outline-none">
      {children}
    </h2>
  );
}
