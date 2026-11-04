/** Cart header focus follows the rendered main/compact controls, independently from order state. */
function isVisibleTrigger(element: HTMLElement): boolean {
  if (!element.isConnected || !element.getClientRects().length) return false;
  const view = element.ownerDocument.defaultView;
  if (!view) return false;
  const style = view.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse')
    return false;
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < view.innerHeight &&
    rect.left < view.innerWidth
  );
}

/** Creating the document's DOM adapter does not read the DOM or browser storage. */
export function createCartDrawerFocus() {
  let opener: HTMLElement | undefined;
  return {
    remember: (element?: HTMLElement) => {
      opener = element;
    },
    restore: () => {
      if (typeof document === 'undefined') return;
      const target =
        opener && isVisibleTrigger(opener)
          ? opener
          : [...document.querySelectorAll<HTMLElement>('[data-cart-trigger]')].find(
              isVisibleTrigger,
            );
      target?.focus({ preventScroll: true });
    },
  };
}
