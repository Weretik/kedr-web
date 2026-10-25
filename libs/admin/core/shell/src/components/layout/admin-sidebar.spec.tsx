import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { AdminSidebar } from './admin-sidebar';
import {
  navigationCollapsedStorageKey,
  useNavigationCollapsed,
} from '../navigation/use-navigation-collapsed';

function CollapsibleSidebar() {
  const { isCollapsed, toggleCollapsed } = useNavigationCollapsed();

  return (
    <AdminSidebar
      currentOrderPositionCount={2}
      isCollapsed={isCollapsed}
      onToggleCollapsed={toggleCollapsed}
    />
  );
}

function renderSidebar() {
  return render(
    <MemoryRouter initialEntries={['/catalog/oliya']}>
      <CollapsibleSidebar />
    </MemoryRouter>,
  );
}

describe('AdminSidebar collapsible navigation', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows labelled sections, the active section, and the current order when expanded', () => {
    renderSidebar();

    expect(screen.getByRole('link', { name: 'Товари' }).getAttribute('aria-current')).toBe('page');
    expect(screen.getByText('Огляд')).toBeTruthy();
    expect(screen.getByText('позицій: 2')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Оформити' }).getAttribute('href')).toBe('/orders/new');
    expect(
      screen.getByRole('button', { name: 'Згорнути меню' }).getAttribute('aria-expanded'),
    ).toBe('true');
  });

  it('collapses to icons with accessible names and remembers the choice', () => {
    const { unmount } = renderSidebar();

    fireEvent.click(screen.getByRole('button', { name: 'Згорнути меню' }));

    expect(screen.queryByText('Огляд')).toBeNull();
    expect(screen.queryByRole('link', { name: 'Оформити' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Клієнти' }).getAttribute('href')).toBe('/customers');
    expect(screen.getByRole('link', { name: 'Товари' }).getAttribute('aria-current')).toBe('page');
    expect(
      screen.getByRole('button', { name: 'Розгорнути меню' }).getAttribute('aria-expanded'),
    ).toBe('false');
    expect(window.localStorage.getItem(navigationCollapsedStorageKey)).toBe('true');

    unmount();
    renderSidebar();

    expect(screen.getByRole('button', { name: 'Розгорнути меню' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Розгорнути меню' }));

    expect(screen.getByText('Огляд')).toBeTruthy();
    expect(window.localStorage.getItem(navigationCollapsedStorageKey)).toBe('false');
  });
});
