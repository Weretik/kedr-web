import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductAttributesCard } from './product-attributes-card';
import { ProductReviewCard } from './product-review-card';

import type { ProductAttributes } from '@admin/products/model';

const data: ProductAttributes = {
  productId: 7,
  originalName: 'Ручка Rio AB/BK L',
  baseName: 'Ручка Rio',
  review: {
    state: 'needs_review',
    reasons: [{ code: 'unresolved_color', text: null }],
    acceptedBy: null,
    acceptedAt: null,
  },
  attributes: [
    {
      attributeId: 1,
      code: 'color',
      name: 'Колір',
      kind: 'enum',
      unit: null,
      isVariantAxis: true,
      values: [
        {
          position: 0,
          valueId: 2,
          valueName: 'Хром',
          number: null,
          source: 'manual',
          isLocked: true,
          isConfirmed: true,
          hasAutomatic: true,
        },
      ],
    },
    {
      attributeId: 2,
      code: 'side',
      name: 'Сторона',
      kind: 'enum',
      unit: null,
      isVariantAxis: true,
      values: [
        {
          position: 0,
          valueId: 5,
          valueName: 'Ліва',
          number: null,
          source: 'import',
          isLocked: false,
          isConfirmed: false,
          hasAutomatic: false,
        },
      ],
    },
  ],
};

describe('ProductAttributesCard', () => {
  it('shows the 1C name, a lock on manual values, and marks only unconfirmed ones', () => {
    const onRestore = vi.fn();
    render(
      <ProductAttributesCard
        busy={false}
        data={data}
        error={null}
        onAdd={vi.fn()}
        onEdit={vi.fn()}
        onRestore={onRestore}
      />,
    );

    expect(screen.getByText('Ручка Rio AB/BK L')).toBeTruthy();
    expect(screen.getByLabelText('Задано вручну')).toBeTruthy();
    expect(screen.getAllByText('Розшифровку не підтверджено')).toHaveLength(1);

    fireEvent.click(screen.getByRole('button', { name: 'Повернути автоматичне' }));
    expect(onRestore).toHaveBeenCalledWith(data.attributes[0]);
  });
});

describe('ProductReviewCard', () => {
  it('offers «Прийняти як є» for a product in review', () => {
    const onAccept = vi.fn();
    render(
      <ProductReviewCard
        busy={false}
        error={null}
        onAccept={onAccept}
        onReopen={vi.fn()}
        review={data.review}
      />,
    );

    expect(screen.getByText('Не розшифровано колір')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Прийняти як є' }));
    expect(onAccept).toHaveBeenCalled();
  });

  it('shows who accepted and offers to reopen', () => {
    render(
      <ProductReviewCard
        busy={false}
        error={null}
        onAccept={vi.fn()}
        onReopen={vi.fn()}
        review={{
          ...data.review,
          state: 'accepted',
          acceptedBy: 'manager@classkedr.com.ua',
          acceptedAt: '2026-11-05T10:00:00Z',
        }}
      />,
    );

    expect(screen.getByText(/manager@classkedr.com.ua/)).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Повернути на перевірку' })).toBeTruthy();
  });

  it('shows nothing when there is nothing to review', () => {
    const { container } = render(
      <ProductReviewCard
        busy={false}
        error={null}
        onAccept={vi.fn()}
        onReopen={vi.fn()}
        review={{ state: 'clear', reasons: [], acceptedBy: null, acceptedAt: null }}
      />,
    );

    expect(container.textContent).toBe('');
  });
});
