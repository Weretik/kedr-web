import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { SiteAttributesPage } from './site-attributes-page';

import type { SiteDictionaryTabProps } from '../model/site-page-tabs';

function renderPage(canEditCatalog: boolean, entry = '/site-attributes') {
  const renderDictionaryTab = vi.fn((props: SiteDictionaryTabProps) => (
    <p>
      Вкладка {props.tab} {props.creating ? 'створення' : ''} {props.canEdit ? 'редагування' : ''}
    </p>
  ));
  render(
    <MemoryRouter initialEntries={[entry]}>
      <SiteAttributesPage
        canEditCatalog={canEditCatalog}
        renderDictionaryTab={renderDictionaryTab}
      />
    </MemoryRouter>,
  );
  return renderDictionaryTab;
}

describe('SiteAttributesPage', () => {
  it('shows «Ознаки» and «Фільтри категорій» and opens the tab from the address', () => {
    renderPage(false, '/site-attributes?tab=filters');
    expect(screen.getByRole('heading', { name: 'Ознаки та фільтри' })).toBeTruthy();
    expect(screen.getAllByRole('tab').map((tab) => tab.textContent)).toEqual([
      'Ознаки',
      'Фільтри категорій',
    ]);
    expect(
      screen.getByRole('tab', { name: 'Фільтри категорій' }).getAttribute('aria-selected'),
    ).toBe('true');
    expect(screen.getByText(/Вкладка filters/)).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'Ознаки' }));
    expect(screen.getByText(/Вкладка attributes/)).toBeTruthy();
  });

  it('gives «Нова ознака» to an Admin only, which opens the new attribute panel', () => {
    renderPage(true);
    fireEvent.click(screen.getByRole('button', { name: 'Нова ознака' }));
    expect(screen.getByText('Вкладка attributes створення редагування')).toBeTruthy();
  });

  it('hides «Нова ознака» from a Manager and on «Фільтри категорій»', () => {
    renderPage(false);
    expect(screen.queryByRole('button', { name: 'Нова ознака' })).toBeNull();
    renderPage(true, '/site-attributes?tab=filters');
    expect(screen.queryByRole('button', { name: 'Нова ознака' })).toBeNull();
  });
});
