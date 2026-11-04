import { act, cleanup, render } from '@testing-library/react';

import { ProductStickyBar } from './product-sticky-bar';

type Callback = (entries: Array<Partial<IntersectionObserverEntry>>) => void;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ProductStickyBar', () => {
  it('shows only after the purchase panel scrolls above the screen', () => {
    let notify: Callback = () => undefined;
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: Callback) {
          notify = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    render(
      <>
        <section id="purchase" />
        <ProductStickyBar targetId="purchase" label="Купити" price="420 грн">
          <button type="button">У кошик</button>
        </ProductStickyBar>
      </>,
    );
    const bar = document.querySelector<HTMLElement>('[aria-label="Купити"]')!;
    expect(bar.hidden).toBe(true);

    act(() => notify([{ isIntersecting: false, boundingClientRect: { top: -200 } as DOMRect }]));
    expect(bar.hidden).toBe(false);

    act(() => notify([{ isIntersecting: false, boundingClientRect: { top: 900 } as DOMRect }]));
    expect(bar.hidden).toBe(true);
  });
});
