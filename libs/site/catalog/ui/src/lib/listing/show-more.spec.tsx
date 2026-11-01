import { fireEvent, render, screen } from '@testing-library/react';

import { ShowMore } from './show-more';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

const product = (id: number) => ({
  id,
  sku: id,
  slug: `p-${id}`,
  name: `Товар ${id}`,
  price: 10,
  photoUrl: null,
  inStock: true,
  isNew: false,
  isSale: false,
});

const firstPage = (totalPages: number) => ({
  items: Array.from({ length: 24 }, (_, index) => product(index + 1)),
  page: 1,
  pageSize: 24,
  totalPages,
  totalRecords: totalPages === 2 ? 25 : 70,
});

describe('ShowMore', () => {
  it('appends the next page and hides the button after the last one', async () => {
    const loadPage = vi.fn().mockResolvedValue({
      items: [product(25)],
      page: 2,
      pageSize: 24,
      totalPages: 2,
      totalRecords: 25,
    });
    render(<ShowMore locale="uk" view="grid" page={firstPage(2)} loadPage={loadPage} />);
    expect(screen.getByText('Показано 1–24 з 25 товарів')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Показати ще' }));

    expect(await screen.findByRole('link', { name: 'Товар 25' })).toBeTruthy();
    expect(loadPage).toHaveBeenCalledWith(2);
    expect(screen.queryByRole('button', { name: 'Показати ще' })).toBeNull();
    expect(screen.getByText('Показано 1–25 з 25 товарів')).toBeTruthy();
  });

  it('says so when loading fails and lets the visitor retry', async () => {
    const loadPage = vi.fn().mockResolvedValue(null);
    render(<ShowMore locale="uk" view="grid" page={firstPage(3)} loadPage={loadPage} />);

    fireEvent.click(screen.getByRole('button', { name: 'Показати ще' }));

    expect((await screen.findByRole('alert')).textContent).toContain('Не вдалося');
    expect(await screen.findByRole('button', { name: 'Показати ще' })).toBeTruthy();
  });
});
