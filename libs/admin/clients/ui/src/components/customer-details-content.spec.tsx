import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { CustomerDetailsContent } from './customer-details-content';

describe('CustomerDetailsContent', () => {
  afterEach(cleanup);

  it('shows three compact information cards without tables or edit controls', () => {
    render(
      <CustomerDetailsContent
        customer={{
          counterpartyId: '0002',
          name: 'Бета',
          phone: null,
          email: 'a@example.com',
          defaultPriceTypeId: 5,
          defaultPriceTypeName: 'Роздрібна',
          categoryPriceTypes: [{ categoryId: 3, categoryName: 'Замки', priceTypeId: 7, priceTypeName: 'Оптова' }],
        }}
      />,
    );

    expect(screen.getAllByText('Бета')).toHaveLength(1);
    expect(within(screen.getByRole('article', { name: 'Бета' })).getByText('0002')).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Контактні дані' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Типи цін' })).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByText('Не вказано')).toBeTruthy();
    expect(screen.getByText('a@example.com')).toBeTruthy();
    expect(screen.getByText('Роздрібна')).toBeTruthy();
    expect(screen.getByText('Замки · ID 3')).toBeTruthy();
    expect(screen.getByText('Оптова')).toBeTruthy();
    expect(screen.queryByText('5')).toBeNull();
    expect(screen.queryByText('7')).toBeNull();
    expect(screen.queryByRole('button', { name: /редагувати|видалити/i })).toBeNull();
  });

  it('shows unavailable names without falling back to price type IDs', () => {
    render(
      <CustomerDetailsContent customer={{
        counterpartyId: '0002', name: 'Бета', phone: '+380123', email: '',
        defaultPriceTypeId: 5, defaultPriceTypeName: null,
        categoryPriceTypes: [{ categoryId: 3, categoryName: null, priceTypeId: 7, priceTypeName: null }],
      }} />,
    );

    expect(screen.getAllByText('Назва недоступна')).toHaveLength(2);
    expect(screen.getByText('Назва недоступна · ID 3')).toBeTruthy();
    expect(screen.queryByText('5')).toBeNull();
    expect(screen.queryByText('7')).toBeNull();
  });
});
