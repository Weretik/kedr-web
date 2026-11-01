import { act, fireEvent, render, screen } from '@testing-library/react';

import { CollapsingHeader } from './collapsing-header';
import { CompactActions } from './compact-actions';
import { getShellDictionary } from '../i18n/shell-dictionary';

const ROWS_HEIGHT = 120;

const setDesktop = (matches: boolean) => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
};

const scrollTo = (y: number) =>
  act(() => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: y });
    fireEvent.scroll(window);
  });

const renderHeader = () =>
  render(
    <CollapsingHeader collapsible={<div>rows</div>}>
      <CompactActions locale="uk" dictionary={getShellDictionary('uk')} />
    </CollapsingHeader>,
  );

describe('CollapsingHeader', () => {
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(ROWS_HEIGHT);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 0;
    });
  });
  afterEach(() => {
    vi.restoreAllMocks();
    scrollTo(0);
  });

  it('on desktop lets the upper rows scroll away and condenses once they are gone', () => {
    setDesktop(true);
    renderHeader();
    const header = screen.getByRole('banner');

    expect(header.style.top).toBe(`-${ROWS_HEIGHT}px`);
    expect(header.hasAttribute('data-condensed')).toBe(false);

    scrollTo(ROWS_HEIGHT);
    expect(header.hasAttribute('data-condensed')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'Пошук товарів' }));
    expect(screen.getByRole('search').getAttribute('action')).toBe('/uk/search');
    expect(screen.getByRole('link', { name: 'Кошик' }).getAttribute('href')).toBe('/uk/checkout');

    scrollTo(0);
    expect(header.hasAttribute('data-condensed')).toBe(false);
    expect(screen.queryByRole('search')).toBeNull();
  });

  it('keeps the whole header on phones', () => {
    setDesktop(false);
    renderHeader();
    scrollTo(500);

    const header = screen.getByRole('banner');
    expect(header.style.top).toBe('0px');
    expect(header.hasAttribute('data-condensed')).toBe(false);
  });
});
