import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AdminDetailHeader } from './admin-detail-header';
import { DetailField, DetailFieldList } from './detail-field';
import { PageLoader } from './page-loader';
import { SectionCard } from './section-card';

describe('AdminDetailHeader', () => {
  it('links back to the list and renders one h1 with actions', () => {
    render(
      <MemoryRouter>
        <AdminDetailHeader
          actions={<button type="button">Редагувати</button>}
          backLabel="Назад до товарів"
          backTo="/catalog?page=2"
          title="Деталі товару"
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Назад до товарів' }).getAttribute('href')).toBe(
      '/catalog?page=2',
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Деталі товару' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Редагувати' })).toBeTruthy();
  });
});

describe('SectionCard and DetailField', () => {
  it('names the card by its heading and lists label-value pairs', () => {
    render(
      <SectionCard title="Контактні дані">
        <DetailFieldList>
          <DetailField label="Телефон" value="+380123" />
        </DetailFieldList>
      </SectionCard>,
    );

    const region = screen.getByRole('region', { name: 'Контактні дані' });
    expect(within(region).getByRole('term').textContent).toBe('Телефон');
    expect(within(region).getByRole('definition').textContent).toBe('+380123');
  });
});

describe('PageLoader', () => {
  it('announces what is loading', () => {
    render(<PageLoader label="Завантаження товару" />);

    expect(screen.getByRole('status', { name: 'Завантаження товару' })).toBeTruthy();
  });
});
