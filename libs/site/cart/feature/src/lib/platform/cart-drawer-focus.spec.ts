import { afterEach, describe, expect, it, vi } from 'vitest';

import { createCartDrawerFocus } from './cart-drawer-focus';

function trigger(kind: string, top = 10) {
  const button = document.createElement('button');
  button.dataset.cartTrigger = kind;
  button.dataset.focusTest = '';
  const rect = new DOMRect(10, top, 44, 44);
  vi.spyOn(button, 'getBoundingClientRect').mockReturnValue(rect);
  vi.spyOn(button, 'getClientRects').mockReturnValue([rect] as unknown as DOMRectList);
  document.body.append(button);
  return button;
}

afterEach(() => {
  vi.unstubAllGlobals();
  document.querySelectorAll('[data-focus-test]').forEach((element) => element.remove());
});

describe('cart drawer DOM focus adapter', () => {
  it('prefers the actual visible opener instead of the first header trigger', () => {
    trigger('main');
    const opener = trigger('compact');
    const focus = vi.spyOn(opener, 'focus');
    const adapter = createCartDrawerFocus();
    adapter.remember(opener);
    adapter.restore();
    expect(document.activeElement).toBe(opener);
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('ignores a connected opener hidden after a responsive resize', () => {
    const opener = trigger('compact');
    opener.style.display = 'none';
    vi.mocked(opener.getClientRects).mockReturnValue([] as unknown as DOMRectList);
    const visible = trigger('main');
    const adapter = createCartDrawerFocus();
    adapter.remember(opener);
    adapter.restore();
    expect(document.activeElement).toBe(visible);
  });

  it('ignores an offscreen main opener when the condensed compact trigger is visible', () => {
    const opener = trigger('main', -100);
    const visible = trigger('compact');
    const adapter = createCartDrawerFocus();
    adapter.remember(opener);
    adapter.restore();
    expect(document.activeElement).toBe(visible);
  });

  it('skips invisible fallback controls after the actual opener is detached', () => {
    const opener = trigger('main');
    const hidden = trigger('main');
    hidden.style.visibility = 'hidden';
    const visible = trigger('compact');
    const adapter = createCartDrawerFocus();
    adapter.remember(opener);
    opener.remove();
    adapter.restore();
    expect(document.activeElement).toBe(visible);
  });

  it('leaves focus unchanged when there is no visible cart trigger', () => {
    const active = document.createElement('button');
    active.dataset.focusTest = '';
    document.body.append(active);
    active.focus();
    const hidden = trigger('main');
    hidden.style.visibility = 'hidden';
    const adapter = createCartDrawerFocus();
    adapter.remember(hidden);
    adapter.restore();
    expect(document.activeElement).toBe(active);
  });

  it('can be created and restored without a document during SSR', () => {
    vi.stubGlobal('document', undefined);
    const adapter = createCartDrawerFocus();
    expect(() => adapter.restore()).not.toThrow();
  });
});
