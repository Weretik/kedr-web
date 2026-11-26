import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SeoReviewFilters } from './seo-review-filters';
import { SeoReviewTable } from './seo-review-table';

import type { SeoReviewItem } from '@admin/seo-review/model';

const row: SeoReviewItem = {
  id: 5,
  issues: ['noText', 'longTitle'],
  kind: 'category',
  language: 'uk',
  name: 'Ручки',
};

describe('SeoReviewTable', () => {
  it('shows the page, its issues and opens the editor', async () => {
    const onOpen = vi.fn();
    render(
      <SeoReviewTable
        error={false}
        loading={false}
        onOpen={onOpen}
        onRetry={vi.fn()}
        rows={[row]}
      />,
    );

    expect(await screen.findByText('Ручки')).toBeTruthy();
    expect(screen.getByText('Немає тексту')).toBeTruthy();
    expect(screen.getByText('Довгий заголовок')).toBeTruthy();
    await userEvent.click(screen.getByRole('button', { name: 'Відкрити «Ручки» для редагування' }));
    expect(onOpen).toHaveBeenCalledWith(row);
  });

  it('offers a retry when the review failed', async () => {
    const onRetry = vi.fn();
    render(
      <SeoReviewTable error loading={false} onOpen={vi.fn()} onRetry={onRetry} rows={[row]} />,
    );

    await userEvent.click(await screen.findByRole('button', { name: 'Повторити' }));
    expect(onRetry).toHaveBeenCalled();
  });
});

describe('SeoReviewFilters', () => {
  it('toggles an issue chip', async () => {
    const onChange = vi.fn();
    const counts = {
      duplicateTitle: 0,
      longDescription: 0,
      longTitle: 1,
      noDescription: 0,
      noText: 3,
    };
    const { rerender } = render(
      <SeoReviewFilters counts={counts} filter={{}} kinds={['category']} onChange={onChange} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Немає тексту · 3' }));
    expect(onChange).toHaveBeenLastCalledWith({ issue: 'noText' });

    rerender(
      <SeoReviewFilters
        counts={counts}
        filter={{ issue: 'noText' }}
        kinds={['category']}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Немає тексту · 3' }));
    expect(onChange).toHaveBeenLastCalledWith({ issue: undefined });
  });
});
