import { useEffect, useState } from 'react';

/** Width of the anchor's parent (the grid toolbar), kept current on resize, to cap the filter panel. */
export function usePanelWidth(panelAnchor: HTMLElement | null) {
  const [panelWidth, setPanelWidth] = useState<number>();

  useEffect(() => {
    const toolbar = panelAnchor?.parentElement;
    if (!toolbar) return;

    const updatePanelWidth = () => {
      const width = toolbar.getBoundingClientRect().width;
      if (width > 0) setPanelWidth(width);
    };

    updatePanelWidth();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updatePanelWidth);
    observer.observe(toolbar);
    return () => observer.disconnect();
  }, [panelAnchor]);

  return panelWidth;
}
