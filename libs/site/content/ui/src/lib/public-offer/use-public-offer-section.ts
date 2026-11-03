import { useEffect, useState } from 'react';

import type { RefObject } from 'react';

interface SectionItem {
  readonly id: string;
  readonly label: string;
}

/** Enhances native section links without owning navigation, focus or scrolling. */
export function usePublicOfferSection(
  items: readonly SectionItem[],
  scopeRef: RefObject<HTMLElement | null>,
): string | null {
  const [currentId, setCurrentId] = useState<string | null>(null);
  // Value identity avoids render loops while still resetting for a localized document.
  const sectionKey = JSON.stringify(items.map(({ id, label }) => ({ id, label })));

  useEffect(() => {
    const descriptors = JSON.parse(sectionKey) as SectionItem[];
    const owner = scopeRef.current?.closest<HTMLElement>('[data-public-offer]');
    const sectionsById = new Map<string, HTMLElement>();
    owner?.querySelectorAll<HTMLElement>('[data-offer-document] section[id]').forEach((section) => {
      sectionsById.set(section.id, section);
    });
    const sections = descriptors
      .map(({ id }) => sectionsById.get(id))
      .filter((section): section is HTMLElement => section !== undefined);
    if (sections.length === 0) {
      setCurrentId(null);
      return;
    }

    const targetIds = new Set(sections.map((section) => section.id));
    let frame: number | null = null;

    const scrollOffset = () => {
      const margin = Number.parseFloat(window.getComputedStyle(sections[0]).scrollMarginTop);
      return Number.isFinite(margin) ? margin : 80;
    };

    const updateFromPosition = () => {
      const readingLine = scrollOffset() + 1;
      let activeId = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingLine) break;
        activeId = section.id;
      }
      setCurrentId(activeId);
    };

    const cancelFrame = () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    };

    const schedulePositionUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateFromPosition();
      });
    };

    const updateFromHash = () => {
      cancelFrame();
      let hash = '';
      try {
        hash = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        // A malformed fragment must not break the document or native links.
      }
      if (targetIds.has(hash)) setCurrentId(hash);
      else updateFromPosition();
    };

    updateFromHash();
    const observer =
      typeof window.IntersectionObserver === 'function'
        ? new IntersectionObserver(schedulePositionUpdate, {
            rootMargin: `-${Math.max(0, scrollOffset())}px 0px 0px 0px`,
            threshold: 0,
          })
        : null;
    for (const section of sections) observer?.observe(section);
    window.addEventListener('scroll', schedulePositionUpdate, { passive: true });
    window.addEventListener('resize', schedulePositionUpdate);
    window.addEventListener('hashchange', updateFromHash);

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', schedulePositionUpdate);
      window.removeEventListener('resize', schedulePositionUpdate);
      window.removeEventListener('hashchange', updateFromHash);
      cancelFrame();
    };
  }, [sectionKey, scopeRef]);

  return currentId;
}
