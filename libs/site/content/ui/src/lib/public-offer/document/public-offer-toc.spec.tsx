import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { PublicOfferToc } from './public-offer-toc';

import type { PublicOfferTocItem } from './public-offer-toc';

const ITEMS = [
  { id: 'offer-general', label: '1. Загальні положення та преамбула' },
  { id: 'offer-site-use', label: '2. Правила користування сайтом' },
  { id: 'offer-payment', label: '3. Ціна та оплата' },
  { id: 'offer-delivery', label: '4. Доставка та відповідальність' },
  { id: 'offer-returns', label: '5. Повернення товару' },
  { id: 'offer-personal-data', label: '6. Персональні дані' },
  { id: 'offer-final', label: '7. Прикінцеві положення' },
] as const;
const LABEL = 'Зміст документа';

let observers: ObserverMock[];
let frames: Map<number, FrameRequestCallback>;
let frameId: number;
let tops: Map<string, number>;

class ObserverMock {
  readonly observe = vi.fn<(target: Element) => void>();
  readonly disconnect = vi.fn();

  constructor(readonly callback: IntersectionObserverCallback) {
    observers.push(this);
  }

  notify() {
    this.callback([], this as unknown as IntersectionObserver);
  }
}

function Fixture({ items = ITEMS }: { items?: readonly PublicOfferTocItem[] }) {
  return (
    <div data-public-offer>
      <button type="button">Інша дія</button>
      <PublicOfferToc items={items} label={LABEL} />
      <article data-offer-document>
        {items.map(({ id, label }) => (
          <section
            key={id}
            id={id}
            style={{ scrollMarginTop: '80px' }}
            ref={(element) => {
              if (element) {
                element.getBoundingClientRect = () => new DOMRect(0, tops.get(id) ?? 0, 500, 400);
              }
            }}
          >
            <h2>{label}</h2>
          </section>
        ))}
      </article>
    </div>
  );
}

function expectCurrent(container: HTMLElement, id: string) {
  expect(
    [...container.querySelectorAll('a[aria-current="location"]')].map((link) =>
      link.getAttribute('href'),
    ),
  ).toEqual(['#' + id, '#' + id]);
}

function flushFrames() {
  act(() => {
    const pending = [...frames.values()];
    frames.clear();
    for (const callback of pending) callback(0);
  });
}

beforeEach(() => {
  observers = [];
  frames = new Map();
  frameId = 0;
  tops = new Map(ITEMS.map(({ id }, index) => [id, 200 + index * 400]));
  window.history.replaceState(null, '', '/uk/public-offer');
  vi.stubGlobal('IntersectionObserver', ObserverMock);
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      frames.set(++frameId, callback);
      return frameId;
    }),
  );
  vi.stubGlobal(
    'cancelAnimationFrame',
    vi.fn((id: number) => frames.delete(id)),
  );
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('public offer contents', () => {
  it('keeps all seven native anchors and the closed mobile disclosure in server HTML', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<PublicOfferToc items={ITEMS} label={LABEL} />);
    const details = container.querySelector('details')!;

    expect(details.hasAttribute('open')).toBe(false);
    expect(details.querySelector('summary')?.textContent).toContain(LABEL);
    for (const navigation of container.querySelectorAll('nav')) {
      expect(navigation.getAttribute('aria-label')).toBe(LABEL);
      expect(
        [...navigation.querySelectorAll('a')].map((link) => link.getAttribute('href')),
      ).toEqual(ITEMS.map(({ id }) => '#' + id));
    }
    expect(container.querySelector('article')).toBeNull();
  });

  it('marks a valid initial hash in both responsive contents without changing history or focus', () => {
    window.history.replaceState(null, '', '/uk/public-offer#offer-payment');
    const pushState = vi.spyOn(window.history, 'pushState');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    const { container } = render(<Fixture />);

    expectCurrent(container, 'offer-payment');
    expect(observers).toHaveLength(1);
    expect(observers[0].observe).toHaveBeenCalledTimes(7);
    expect(pushState).not.toHaveBeenCalled();
    expect(replaceState).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
    expect(container.querySelector('details')?.hasAttribute('open')).toBe(false);
  });

  it('updates the current section at its sticky-header offset after observer and scroll events', () => {
    const { container } = render(<Fixture />);
    expectCurrent(container, 'offer-general');
    const action = container.querySelector('button')!;
    action.focus();
    const pushState = vi.spyOn(window.history, 'pushState');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    expect(observers).toHaveLength(1);

    tops.set('offer-general', -400);
    tops.set('offer-site-use', 79);
    act(() => observers[0].notify());
    flushFrames();
    expectCurrent(container, 'offer-site-use');

    tops.set('offer-payment', 78);
    fireEvent.scroll(window);
    flushFrames();
    expectCurrent(container, 'offer-payment');
    expect(document.activeElement).toBe(action);
    expect(window.location.pathname).toBe('/uk/public-offer');
    expect(pushState).not.toHaveBeenCalled();
    expect(replaceState).not.toHaveBeenCalled();
  });

  it('uses the mobile scroll margin when identifying the current section', () => {
    const { container } = render(<Fixture />);
    expectCurrent(container, 'offer-general');
    for (const section of container.querySelectorAll('section'))
      section.style.scrollMarginTop = '192px';
    tops.set('offer-general', -240);
    tops.set('offer-site-use', 160);

    fireEvent.resize(window);
    flushFrames();
    expectCurrent(container, 'offer-site-use');
  });

  it('keeps hash navigation and scrolling functional without IntersectionObserver', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const { container } = render(<Fixture />);
    expectCurrent(container, 'offer-general');
    const action = container.querySelector('button')!;
    action.focus();

    window.history.replaceState(null, '', '/uk/public-offer#offer-personal-data');
    act(() => window.dispatchEvent(new HashChangeEvent('hashchange')));
    expectCurrent(container, 'offer-personal-data');
    expect(document.activeElement).toBe(action);
    expect(container.querySelector('details')?.hasAttribute('open')).toBe(false);

    tops.set('offer-general', -400);
    tops.set('offer-site-use', 50);
    fireEvent.scroll(window);
    flushFrames();
    expectCurrent(container, 'offer-site-use');
    expect(observers).toHaveLength(0);
  });

  it.each(['#unknown', '#%E0%A4%A'])('ignores an unknown or malformed initial hash: %s', (hash) => {
    window.history.replaceState(null, '', '/uk/public-offer' + hash);
    const { container } = render(<Fixture />);

    expectCurrent(container, 'offer-general');
    expect(container.querySelector('details a')?.getAttribute('href')).toBe('#offer-general');
  });

  it('keeps observation stable for equal item IDs and cleans it up when the item set changes', () => {
    const { container, rerender, unmount } = render(<Fixture />);
    expect(observers).toHaveLength(1);
    const originalObserver = observers[0];

    rerender(<Fixture items={ITEMS.map((item) => ({ ...item }))} />);
    expect(observers).toHaveLength(1);

    rerender(<Fixture items={ITEMS.slice(1)} />);
    expect(originalObserver.disconnect).toHaveBeenCalledOnce();
    expect(observers).toHaveLength(2);
    expect(observers[1].observe).toHaveBeenCalledTimes(6);
    expectCurrent(container, 'offer-site-use');

    unmount();
    expect(observers[1].disconnect).toHaveBeenCalledOnce();
  });

  it('removes scroll, resize and hash listeners and cancels a pending frame on unmount', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Fixture />);
    expect(observers).toHaveLength(1);

    fireEvent.scroll(window);
    expect(frames.size).toBe(1);
    unmount();

    expect(frames.size).toBe(0);
    expect(window.cancelAnimationFrame).toHaveBeenCalledOnce();
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    for (const event of ['scroll', 'resize', 'hashchange']) {
      const registration = addEventListener.mock.calls.find(([name]) => name === event);
      expect(registration).toBeDefined();
      expect(removeEventListener).toHaveBeenCalledWith(event, registration![1]);
    }
  });

  it('restarts observation when localized item labels change with the same section IDs', () => {
    const { rerender, unmount } = render(<Fixture />);
    expect(observers).toHaveLength(1);

    rerender(
      <Fixture items={ITEMS.map(({ id }, index) => ({ id, label: 'Раздел ' + (index + 1) }))} />,
    );
    expect(observers).toHaveLength(2);
    expect(observers[0].disconnect).toHaveBeenCalledOnce();
    expect(observers[1].observe).toHaveBeenCalledTimes(7);

    unmount();
    expect(observers[1].disconnect).toHaveBeenCalledOnce();
  });
});

it('observes only the current document when an inactive copy with the same IDs is retained', () => {
  const cached = document.createElement('div');
  cached.setAttribute('data-public-offer', '');
  cached.hidden = true;
  const cachedDocument = document.createElement('article');
  cachedDocument.setAttribute('data-offer-document', '');
  cached.appendChild(cachedDocument);
  for (const { id } of ITEMS) {
    const section = document.createElement('section');
    section.id = id;
    section.getBoundingClientRect = () => new DOMRect(0, 0, 0, 0);
    cachedDocument.appendChild(section);
  }
  document.body.prepend(cached);
  try {
    const { container } = render(<Fixture />);
    expectCurrent(container, 'offer-general');
    expect(observers).toHaveLength(1);
    const observed = observers[0].observe.mock.calls.map(([element]) => element as Element);
    expect(observed).toHaveLength(7);
    expect(observed.every((element) => container.contains(element))).toBe(true);
    expect(observed.some((element) => cached.contains(element))).toBe(false);
    tops.set('offer-general', -400);
    tops.set('offer-site-use', 50);
    fireEvent.scroll(window);
    flushFrames();
    expectCurrent(container, 'offer-site-use');
  } finally {
    cached.remove();
  }
});
