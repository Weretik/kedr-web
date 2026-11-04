'use client';

import { useEffect, useState } from 'react';

import type { ReactNode } from 'react';

/**
 * Phone and tablet buy bar: appears once the purchase panel has scrolled above the screen, so the price and the
 * cart button stay one tap away on a long page.
 */
export function ProductStickyBar({
  targetId,
  label,
  price,
  children,
}: {
  targetId: string;
  label: string;
  price: string;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetId]);

  return (
    <div
      role="region"
      aria-label={label}
      hidden={!visible}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-3">
        <p className="min-w-0 text-lg font-bold tabular-nums [overflow-wrap:anywhere]">{price}</p>
        {children}
      </div>
    </div>
  );
}
