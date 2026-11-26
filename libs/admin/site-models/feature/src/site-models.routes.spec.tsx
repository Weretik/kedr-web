import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter, useLocation, useRoutes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { createSiteModelsRoutes } from './site-models.routes';

import type { ReactNode } from 'react';

vi.mock('./components/panels/site-model-panels-provider', () => ({
  SiteModelPanelsProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="panels">{children}</div>
  ),
}));
vi.mock('./pages/site-models-page', () => ({ default: () => <h1>Моделі</h1> }));
vi.mock('./pages/site-model-page', () => ({ default: () => <h1>Модель</h1> }));
vi.mock('./pages/site-review-page', () => ({
  default: ({ codesCount }: { codesCount?: number }) => <h1>Перевірка {codesCount}</h1>,
}));
vi.mock('./pages/site-attributes-page', () => ({
  default: ({ canEditCatalog }: { canEditCatalog: boolean }) => (
    <h1>Ознаки та фільтри {canEditCatalog ? 'Admin' : 'Manager'}</h1>
  ),
}));

const routes = createSiteModelsRoutes({
  renderDictionaryTab: () => null,
  useCanEditCatalog: () => true,
  useUnresolvedCodesCount: () => 3,
});

function Address() {
  const location = useLocation();
  return <output aria-label="Адреса">{`${location.pathname}${location.search}`}</output>;
}

function Routes() {
  return useRoutes(routes);
}

const renderAt = (entry: string) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Suspense fallback={null}>
        <Routes />
      </Suspense>
      <Address />
    </MemoryRouter>,
  );

describe('site models routes', () => {
  it.each([
    ['/site-models', 'Моделі'],
    ['/site-models/5', 'Модель'],
    ['/site-review', 'Перевірка 3'],
    ['/site-attributes', 'Ознаки та фільтри Admin'],
  ])('opens %s inside the shared panels', async (entry, heading) => {
    renderAt(entry);
    expect(await screen.findByRole('heading', { name: heading })).toBeTruthy();
    expect(screen.getByTestId('panels')).toBeTruthy();
  });

  it.each([
    ['/site-showcase', '/site-models'],
    ['/site-showcase?view=review', '/site-review?tab=new'],
    ['/site-showcase?view=lone', '/site-review?tab=lone'],
    ['/site-showcase?view=problems', '/site-models?problem=any'],
    ['/site-showcase?item=m42', '/site-models/42'],
    ['/site-showcase?tab=filters', '/site-attributes?tab=filters'],
    ['/site-showcase?tab=codes', '/site-review?tab=codes'],
    ['/catalog-attributes', '/site-attributes?tab=attributes'],
    ['/catalog-attributes?tab=codes', '/site-review?tab=codes'],
  ])('sends the old address %s to %s', async (entry, target) => {
    renderAt(entry);
    await screen.findByRole('heading');
    expect(screen.getByLabelText('Адреса').textContent).toBe(target);
  });
});
