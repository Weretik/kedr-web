'use client';

import { cn } from '@site/shared/ui';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import type { ReactNode } from 'react';

const CondensedContext = createContext(false);

/** Whether the desktop header is scrolled down to its last row. */
export const useHeaderCondensed = () => useContext(CondensedContext);

const DESKTOP = '(min-width: 768px)';

type CollapsingHeaderProps = {
  /** Rows that scroll away on desktop: the top bar and the main bar. */
  collapsible: ReactNode;
  /** Row that stays: the category bar. */
  children: ReactNode;
  className?: string;
};

/**
 * Sticky header. On desktop its top is moved up by the height of the collapsible rows, so they scroll away and only
 * the last row stays; once they are gone the header gets `data-condensed`, which shows the compact search and cart.
 * Phones keep the whole header, which has no category row.
 */
export function CollapsingHeader({ collapsible, children, className }: CollapsingHeaderProps) {
  const rowsRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [condensed, setCondensed] = useState(false);

  useEffect(() => {
    const rows = rowsRef.current;
    if (!rows) return;
    const media = window.matchMedia?.(DESKTOP);
    let height = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      setCondensed(height > 0 && window.scrollY >= height);
    };
    const measure = () => {
      height = media?.matches ? rows.offsetHeight : 0;
      setOffset(height);
      update();
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    observer?.observe(rows);
    media?.addEventListener('change', measure);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer?.disconnect();
      media?.removeEventListener('change', measure);
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      data-condensed={condensed || undefined}
      style={{ top: -offset }}
      className={cn('group/header sticky z-30', className)}
    >
      <div ref={rowsRef}>{collapsible}</div>
      <CondensedContext.Provider value={condensed}>{children}</CondensedContext.Provider>
    </header>
  );
}
